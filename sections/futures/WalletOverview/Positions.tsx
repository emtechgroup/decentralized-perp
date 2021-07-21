import { Synths } from 'constants/currency';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import { FuturesPosition } from 'queries/futures/types';

import ROUTES from 'constants/routes';
import { FlexDivCol } from 'styles/common';
import { Subheader } from '../common';
import { PositionSide } from '../types';
import PositionCard from './PositionCard';

import Button from 'components/Button';

type PositionsProps = {
	positions: Partial<FuturesPosition>[] | null;
};

const DEFAULT_ASSET = 'sBTC';

const Positions: React.FC<PositionsProps> = ({ positions }) => {
	const { t } = useTranslation();
	const router = useRouter();
	console.log(positions);

	const defaultPosition = {
		position: {
			side: PositionSide.LONG,
			amount: 1000,
			currency: Synths.sBTC,
		},
		price: 2500,
		liquidationPrice: 2000,
		margin: 10000,
		marginChange: 0.2,
		riskOfLiquidation: false,
	};

	return (
		<FlexDivCol>
			<StyledSubheader>{t('futures.wallet-overview.positions.title')}</StyledSubheader>
			{positions && positions.length > 0 ? (
				positions.map((position, i) => <PositionCard key={i} position={position} />)
			) : (
				<CTA>
					<CTAButton
						onClick={() => router.push(ROUTES.Futures.Market.MarketPair(DEFAULT_ASSET))}
						variant="primary"
						isRounded
						size="lg"
					>
						{t('futures.wallet-overview.open-position')}
					</CTAButton>
					<Background>{/* <PositionCard position={defaultPosition} isCTA={true} /> */}</Background>
				</CTA>
			)}
		</FlexDivCol>
	);
};
export default Positions;

const CTA = styled.div`
	position: relative;
	width: 100%;
`;

const Background = styled.div`
	position: relative;
	width: 100%;
	filter: blur(2px);
`;

const CTAButton = styled(Button)`
	position: absolute;
	z-index: 1;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

const StyledSubheader = styled(Subheader)`
	margin-bottom: 16px;
`;