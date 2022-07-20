import { FC } from 'react';

import { DesktopOnlyView, MobileOrTabletView } from 'components/Media';
import NotificationContainer from 'constants/NotificationContainer';
import { FullScreenContainer, MobileScreenContainer } from 'styles/common';

import Header from './Header';
import MobileUserMenu from './Header/MobileUserMenu';

type AppLayoutProps = {
	children: React.ReactNode;
};

const AppLayout: FC<AppLayoutProps> = ({ children }) => (
	<>
		<DesktopOnlyView>
			<FullScreenContainer>
				<Header />
				{children}
				<NotificationContainer />
			</FullScreenContainer>
		</DesktopOnlyView>
		<MobileOrTabletView>
			<MobileScreenContainer>
				{children}
				<MobileUserMenu />
			</MobileScreenContainer>
		</MobileOrTabletView>
	</>
);

export default AppLayout;
