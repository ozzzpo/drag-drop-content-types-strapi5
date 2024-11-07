import { useIntl } from "react-intl";
import * as Tooltip from '@radix-ui/react-tooltip';
import { Typography, Box } from "@strapi/design-system";
import { getTranslation as getTrad } from '../utils/getTranslation';

interface SettingsTooltipProps {
    children: React.ReactNode;
    tooltip: string;
}

const SettingsTooltip = ({ children, tooltip }: SettingsTooltipProps) => {
    const { formatMessage } = useIntl();

    return (
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <button style={{
                        border: 'none',
                        padding: 0,
                        marginLeft: 4,
                        background: 'transparent',
                    }}>
                        {children}
                    </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content sideOffset={5}>
                        <Box padding={4} margin={2} background="neutral0"
                            hasRadius
                            shadow="filterShadow">
                            <Typography>
                                {formatMessage({ id: getTrad(tooltip) })}
                            </Typography>
                            <Tooltip.Arrow />
                        </Box>
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}

export default SettingsTooltip;