import React from 'react';
import styled from 'styled-components';
import Wei from '@synthetixio/wei';

import InfoBox from 'components/InfoBox';
import useSelectedPriceCurrency from 'hooks/useSelectedPriceCurrency';
import { formatCurrency, zeroBN } from 'utils/formatters/number';
import { NO_VALUE } from 'constants/placeholder';
import useGetNextPriceDetails from 'queries/futures/useGetNextPriceDetails';
import { computeNPFee } from 'utils/nextPrice';
import Connector from 'containers/Connector';
import { getMarketKey } from 'utils/futures';

type FeeInfoBoxProps = {
	currencyKey: string | null;
	orderType: number;
	feeCost: Wei | null;
	sizeDelta: Wei;
};

const FeeInfoBox: React.FC<FeeInfoBoxProps> = ({ orderType, feeCost, currencyKey, sizeDelta }) => {
	const { selectedPriceCurrency } = useSelectedPriceCurrency();
	const { network } = Connector.useContainer();
	const nextPriceDetailsQuery = useGetNextPriceDetails(getMarketKey(currencyKey, network.id));
	const nextPriceDetails = nextPriceDetailsQuery.data;

	const nextPriceFee = React.useMemo(() => computeNPFee(nextPriceDetails, sizeDelta), [
		nextPriceDetails,
		sizeDelta,
	]);

	const totalDeposit = React.useMemo(() => {
		return (feeCost ?? zeroBN).add(nextPriceDetails?.keeperDeposit ?? zeroBN);
	}, [feeCost, nextPriceDetails?.keeperDeposit]);

	const nextPriceDiscount = React.useMemo(() => {
		return (nextPriceFee ?? zeroBN).sub(feeCost ?? zeroBN);
	}, [feeCost, nextPriceFee]);

	return (
		<StyledInfoBox
			details={{
				...(orderType === 1
					? {
							'Keeper Deposit': {
								value: !!nextPriceDetails?.keeperDeposit
									? formatCurrency(selectedPriceCurrency.name, nextPriceDetails.keeperDeposit, {
											sign: selectedPriceCurrency.sign,
											minDecimals: 2,
									  })
									: NO_VALUE,
							},
							'Commit Deposit': {
								value: !!feeCost
									? formatCurrency(selectedPriceCurrency.name, feeCost, {
											sign: selectedPriceCurrency.sign,
											minDecimals: feeCost.lt(0.01) ? 4 : 2,
									  })
									: NO_VALUE,
							},
							'Total Deposit': {
								value: formatCurrency(selectedPriceCurrency.name, totalDeposit, {
									sign: selectedPriceCurrency.sign,
									minDecimals: 2,
								}),
								spaceBeneath: true,
							},
							'Next-Price Discount': {
								value: !!nextPriceDiscount
									? formatCurrency(selectedPriceCurrency.name, nextPriceDiscount, {
											sign: selectedPriceCurrency.sign,
											minDecimals: 2,
									  })
									: NO_VALUE,
								color: nextPriceDiscount.lt(0)
									? 'green'
									: nextPriceDiscount.gt(0)
									? 'red'
									: undefined,
							},
							'Estimated Fees': {
								value: formatCurrency(
									selectedPriceCurrency.name,
									totalDeposit.add(nextPriceDiscount ?? zeroBN),
									{
										minDecimals: 2,
										sign: selectedPriceCurrency.sign,
									}
								),
							},
					  }
					: {
							Fee: {
								value: !!feeCost
									? formatCurrency(selectedPriceCurrency.name, feeCost, {
											sign: selectedPriceCurrency.sign,
											minDecimals: feeCost.lt(0.01) ? 4 : 2,
									  })
									: NO_VALUE,
							},
					  }),
			}}
		/>
	);
};

const StyledInfoBox = styled(InfoBox)`
	margin-bottom: 16px;
`;

export default FeeInfoBox;
