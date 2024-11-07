import React, { useEffect, useRef, useState } from 'react';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import { Page, Layouts } from '@strapi/strapi/admin';

//migration guide
// https://design-system-git-main-strapijs.vercel.app/?path=/docs/getting-started-migration-guides-v1-to-v2--docs
import {
    Flex,
    Box,
    Button,
    Grid,
    Typography,
    Field,
    TextInput,
    Toggle,
} from '@strapi/design-system';

import { Information, Check } from '@strapi/icons';
import { PluginSettingsResponse, PluginSettingsBody } from '../../../typings';
import { useIntl } from 'react-intl';
import { getTranslation as getTrad } from '../utils/getTranslation';
import SettingsTooltip from '../components/SettingsTooltip';

interface SettingsResponse {
    body: string;
}

const Settings = () => {
    const { formatMessage } = useIntl();

    const isMounted = useRef(true);
    const { get, post } = useFetchClient();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await get<PluginSettingsResponse>(`/drag-drop-content-types/settings`);
            setSettings(data.body);
            setIsLoading(false);
        }
        fetchData();

        // unmount
        return () => {
            isMounted.current = false;
        };
    }, [])

    const defaultSettingsBody: PluginSettingsBody = { title: '', subtitle: '', rank: '', triggerWebhooks: false };
    const [settings, setSettings] = useState<PluginSettingsBody>(defaultSettingsBody);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { toggleNotification } = useNotification();

    const handleSubmit = async () => {
        if (!settings)
            return;

        setIsSaving(true);

        const res = await post(`/drag-drop-content-types/settings`, {
            method: 'POST',
            body: settings
        });
        setSettings(res.data.body);
        setIsSaving(false);

        toggleNotification({
            type: 'success',
            message: formatMessage({
                id: 'plugin.settings.updated',
                defaultMessage: 'Settings successfully updated',
            }),
        });
    };

    return (
        <>
            <Layouts.Header
                id="title"
                title={formatMessage({ id: getTrad("plugin.settings.title") })}
                subtitle={formatMessage({ id: getTrad("plugin.settings.subtitle") })}
                primaryAction={
                    isLoading ? (
                        <></>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            startIcon={<Check />}
                            size="L"
                            disabled={isSaving}
                            loading={isSaving}
                        >
                            {formatMessage({ id: getTrad("plugin.settings.buttons.save") })}
                        </Button>
                    )
                }
            ></Layouts.Header>
            {isLoading ? (
                <Page.Loading />
            ) : (
                <Layouts.Content>
                    <Box
                        background="neutral0"
                        hasRadius
                        shadow="filterShadow"
                        paddingTop={6}
                        paddingBottom={6}
                        paddingLeft={7}
                        paddingRight={7}
                    >
                        <Flex size={3} direction="column">
                            <Box paddingBottom={6}>
                                <Typography variant="beta" as="h2">
                                    {formatMessage({ id: getTrad('plugin.settings.field-names') })}
                                </Typography>
                            </Box>
                            <Grid.Root gap={6}>

                                {/* rank */}
                                <Grid.Item col={6} s={12}>
                                    <Box padding={0}>
                                        <Field.Root name="field_rank" hint={formatMessage({ id: getTrad("plugin.settings.rank.hint") })}>
                                            <Field.Label>
                                                {formatMessage({ id: getTrad("plugin.settings.rank.label") })}
                                                <SettingsTooltip tooltip='plugin.settings.rank.tooltip'>
                                                    <Information />
                                                </SettingsTooltip>
                                            </Field.Label>
                                            <Flex size={12}>
                                                <TextInput
                                                    placeholder="Rank"
                                                    name="content"
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        setSettings({
                                                            ...settings,
                                                            rank: e.target.value,
                                                        });
                                                    }}
                                                    value={settings.rank}
                                                />
                                            </Flex>
                                            <Field.Hint />
                                        </Field.Root>
                                    </Box>
                                </Grid.Item>

                                {/* title */}
                                <Grid.Item col={6} s={12}>
                                    <Box padding={0}>
                                        <Field.Root name="field_title" hint={formatMessage({ id: getTrad("plugin.settings.title.hint") })}>
                                            <Field.Label>
                                                {formatMessage({ id: getTrad("plugin.settings.title.label") })}
                                                <SettingsTooltip tooltip='plugin.settings.title.tooltip'>
                                                    <Information />
                                                </SettingsTooltip>
                                            </Field.Label>
                                            <Flex size={12}>
                                                <TextInput
                                                    placeholder="Title"
                                                    name="content"
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        setSettings({
                                                            ...settings,
                                                            title: e.target.value,
                                                        });
                                                    }}
                                                    value={settings.title}
                                                />
                                            </Flex>
                                            <Field.Hint />
                                        </Field.Root>
                                    </Box>
                                </Grid.Item>

                                {/* subtitle */}
                                <Grid.Item col={6} s={12}>
                                    <Box padding={0}>
                                        <Field.Root name="field_subtitle" hint={formatMessage({ id: getTrad("plugin.settings.subtitle.hint") })}>
                                            <Field.Label>
                                                {formatMessage({ id: getTrad("plugin.settings.subtitle.label") })}
                                                <SettingsTooltip tooltip='plugin.settings.subtitle.tooltip'>
                                                    <Information />
                                                </SettingsTooltip>
                                            </Field.Label>
                                            <Flex size={12}>
                                                <TextInput
                                                    placeholder="Subtitle"
                                                    name="content"
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        setSettings({
                                                            ...settings,
                                                            subtitle: e.target.value,
                                                        });
                                                    }}
                                                    value={settings.subtitle}
                                                />
                                            </Flex>
                                            <Field.Hint />
                                        </Field.Root>
                                    </Box>
                                </Grid.Item>

                                <Grid.Item col={6} s={12}>
                                    <Field.Root name="field_triggerWebhooks" hint={formatMessage({ id: getTrad("plugin.settings.triggerWebhooks.hint") })}>
                                        <Field.Label>
                                            {formatMessage({ id: getTrad("plugin.settings.triggerWebhooks.label") })}
                                            <SettingsTooltip tooltip='plugin.settings.triggerWebhooks.tooltip'>
                                                <Information />
                                            </SettingsTooltip>
                                        </Field.Label>
                                        <Toggle
                                            checked={settings?.triggerWebhooks ?? false}
                                            name="triggerWebhooks"
                                            onLabel={formatMessage({ id: getTrad("plugin.settings.buttons.on") })}
                                            offLabel={formatMessage({ id: getTrad("plugin.settings.buttons.off") })}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setSettings({
                                                    ...settings,
                                                    triggerWebhooks: e.target.checked
                                                });
                                            }}
                                        />
                                        <Field.Hint />
                                    </Field.Root>

                                </Grid.Item>
                            </Grid.Root>
                        </Flex>
                    </Box>

                </Layouts.Content>
            )}
        </>
    );
};

export default Settings;