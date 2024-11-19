/*
Copyright 2024 New Vector Ltd.
Copyright 2019-2023 The Matrix.org Foundation C.I.C.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import React, { type ReactNode } from "react";
import { logger } from "matrix-js-sdk/src/logger";
import { type EmptyObject } from "matrix-js-sdk/src/matrix";

import AccessibleButton from "../../../elements/AccessibleButton";
import { _t } from "../../../../../languageHandler";
import SdkConfig from "../../../../../SdkConfig";
import Modal from "../../../../../Modal";
import PlatformPeg from "../../../../../PlatformPeg";
import UpdateCheckButton from "../../UpdateCheckButton";
import BugReportDialog from "../../../dialogs/BugReportDialog";
import CopyableText from "../../../elements/CopyableText";
import SettingsTab from "../SettingsTab";
import { SettingsSection } from "../../shared/SettingsSection";
import { SettingsSubsection, SettingsSubsectionText } from "../../shared/SettingsSubsection";
import ExternalLink from "../../../elements/ExternalLink";
import MatrixClientContext from "../../../../../contexts/MatrixClientContext";
import SettingsStore from "../../../../../settings/SettingsStore";

/**
* IBM CHANGES FOR BRANDING - DO NOT OVERWRITE
*
* START
*/
const aboutUrl = SdkConfig.get().custom_about_url ? SdkConfig.get().custom_about_url : null;
const helpUrl = SdkConfig.get().custom_help_url ? SdkConfig.get().custom_help_url : null;
const creditsUrl = SdkConfig.get().credits_url ? SdkConfig.get().credits_url : null;
const creditsName = SdkConfig.get().credits_name ? SdkConfig.get().credits_name : null;
const licenseUrl = SdkConfig.get().license_url ? SdkConfig.get().license_url : null;
const licenseName = SdkConfig.get().license_name ? SdkConfig.get().license_name : null;
/**
* END
*
* IBM CHANGES FOR BRANDING - DO NOT OVERWRITE
*/

interface IState {
    appVersion: string | null;
    canUpdate: boolean;
}

export default class HelpUserSettingsTab extends React.Component<EmptyObject, IState> {
    public static contextType = MatrixClientContext;
    declare public context: React.ContextType<typeof MatrixClientContext>;

    public constructor(props: EmptyObject, context: React.ContextType<typeof MatrixClientContext>) {
        super(props, context);

        this.state = {
            appVersion: null,
            canUpdate: false,
        };
    }

    public componentDidMount(): void {
        PlatformPeg.get()
            ?.getAppVersion()
            .then((ver) => this.setState({ appVersion: ver }))
            .catch((e) => {
                logger.error("Error getting vector version: ", e);
            });
        PlatformPeg.get()
            ?.canSelfUpdate()
            .then((v) => this.setState({ canUpdate: v }))
            .catch((e) => {
                logger.error("Error getting self updatability: ", e);
            });
    }

/**
    * IBM CHANGES FOR BRANDING - DO NOT OVERWRITE
    *
    * START
    */

private getVersionInfo(): { messengerVersion: string; elementVersion: string; cryptoVersion: string } {
    const brand = SdkConfig.get().brand;
    const messengerVersion = SdkConfig.get().version || "unknown";
    const elementVersion = this.state.appVersion || "unknown";
    const cryptoVersion = this.context.getCrypto()?.getVersion() ?? "<not-enabled>";

    return {
        messengerVersion: `${_t("setting|help_about|brand_version", { brand })} ${messengerVersion}`,
        elementVersion: `${"Konfiguriert durch IBM Consulting - basierend auf Element Version: "} ${elementVersion}`,
        cryptoVersion: `${_t("setting|help_about|crypto_version")} ${cryptoVersion}`,
    };
}
/**
* END
*
* IBM CHANGES FOR BRANDING - DO NOT OVERWRITE
*/

    private onClearCacheAndReload = (): void => {
        if (!PlatformPeg.get()) return;

        // Dev note: please keep this log line, it's useful when troubleshooting a MatrixClient suddenly
        // stopping in the middle of the logs.
        logger.log("Clear cache & reload clicked");
        this.context.stopClient();
        this.context.store.deleteAllData().then(() => {
            PlatformPeg.get()?.reload();
        });
    };

    private onBugReport = (): void => {
        Modal.createDialog(BugReportDialog, {});
    };

    private renderLegal(): ReactNode {
        const tocLinks = SdkConfig.get().terms_and_conditions_links;
        if (!tocLinks) return null;

        const legalLinks: JSX.Element[] = [];
        for (const tocEntry of tocLinks) {
            legalLinks.push(
                <div key={tocEntry.url}>
                    <ExternalLink href={tocEntry.url}>{tocEntry.text}</ExternalLink>
                </div>,
            );
        }

        return (
            <SettingsSubsection heading={_t("common|legal")}>
                <SettingsSubsectionText>{legalLinks}</SettingsSubsectionText>
            </SettingsSubsection>
        );
    }

    private renderCredits(): JSX.Element {
        // Note: This is not translated because it is legal text.
        // Also, &nbsp; is ugly but necessary.
        return (
            <SettingsSubsection heading={_t("common|credits")}>
                <SettingsSubsectionText>
                    <ul>
                    {
                    /**
                    * IBM CHANGES FOR BRANDING - DO NOT OVERWRITE
                    *
                    * START
                    */
                    }
                    { creditsName!=null && creditsUrl!=null && <li>
                        <>
                        Das{" "}
                        <a href="themes/branding/background.png" rel="noreferrer noopener" target="_blank">
                            Hintergrundbild
                        </a>{" "}
                        ist ©&nbsp;
                        <a href={creditsUrl} rel="noreferrer noopener" target="_blank">
                            {creditsName}
                        </a>{" "}
                        </>
                        { creditsName!=null && creditsUrl!=null && licenseName!=null && licenseUrl!=null &&
                        <>
                        unter den Lizenzbedingungen von &nbsp;
                        <a
                            href={licenseUrl}
                            rel="noreferrer noopener"
                            target="_blank"
                        >
                            {licenseName}
                        </a>
                        </>}
                        .
                    </li>
                    }
                    {
                    /**
                    * END
                    *
                    * IBM CHANGES FOR BRANDING - DO NOT OVERWRITE
                    */
                    }
                        <li>
                            {_t(
                                "credits|twemoji_colr",
                                {},
                                {
                                    colr: (sub) => (
                                        <ExternalLink
                                            href="https://github.com/matrix-org/twemoji-colr"
                                            rel="noreferrer noopener"
                                            target="_blank"
                                        >
                                            {sub}
                                        </ExternalLink>
                                    ),
                                    author: (sub) => <ExternalLink href="https://mozilla.org">{sub}</ExternalLink>,
                                    terms: (sub) => (
                                        <ExternalLink
                                            href="https://www.apache.org/licenses/LICENSE-2.0"
                                            rel="noreferrer noopener"
                                            target="_blank"
                                        >
                                            {sub}
                                        </ExternalLink>
                                    ),
                                },
                            )}
                        </li>
                        <li>
                            {_t(
                                "credits|twemoji",
                                {},
                                {
                                    twemoji: (sub) => (
                                        <ExternalLink href="https://twemoji.twitter.com/">{sub}</ExternalLink>
                                    ),
                                    author: (sub) => (
                                        <ExternalLink href="https://twemoji.twitter.com/">{sub}</ExternalLink>
                                    ),
                                    terms: (sub) => (
                                        <ExternalLink
                                            href="https://creativecommons.org/licenses/by/4.0/"
                                            rel="noreferrer noopener"
                                            target="_blank"
                                        >
                                            {sub}
                                        </ExternalLink>
                                    ),
                                },
                            )}
                        </li>
                    </ul>
                </SettingsSubsectionText>
            </SettingsSubsection>
        );
    }

    /**
     * IBM CHANGES FOR BRANDING - DO NOT OVERWRITE
     *
     * START
    */
    private getVersionTextToCopy = (): string => {
        const { messengerVersion, elementVersion, cryptoVersion } = this.getVersionInfo();
        return `${messengerVersion}\n${elementVersion}\n${cryptoVersion}`;
    };
    /**
    * END
    *
    * IBM CHANGES FOR BRANDING - DO NOT OVERWRITE
    */

    public render(): React.ReactNode {
        const brand = SdkConfig.get().brand;

        /**
         * IBM CHANGES FOR BRANDING - DO NOT OVERWRITE
         *
         * START
        */

        let faqText = _t(
            "setting|help_about|help_link",
            {
                brand,
            },
            {
                'a': (sub) => <a
                    href={helpUrl}
                    rel="noreferrer noopener"
                    target="_blank"
                >
                    { sub }
                </a>,
            },
        );
        if (!(SdkConfig.get().custom_help_url)) {
            faqText = '';
        }

        /**
         * END
         *
         * IBM CHANGES FOR BRANDING - DO NOT OVERWRITE
        */

        let updateButton: JSX.Element | undefined;
        if (this.state.canUpdate) {
            updateButton = <UpdateCheckButton />;
        }

        let bugReportingSection;
        if (SdkConfig.get().bug_report_endpoint_url) {
            bugReportingSection = (
                <SettingsSubsection
                    heading={_t("bug_reporting|title")}
                    description={
                        <>
                            <SettingsSubsectionText>{_t("bug_reporting|introduction")}</SettingsSubsectionText>
                            {_t("bug_reporting|description")}
                        </>
                    }
                >
                    <AccessibleButton onClick={this.onBugReport} kind="primary_outline">
                        {_t("bug_reporting|submit_debug_logs")}
                    </AccessibleButton>
                    <SettingsSubsectionText>
                        {_t(
                            "bug_reporting|matrix_security_issue",
                            {},
                            {
                                a: (sub) => (
                                    <ExternalLink href="https://matrix.org/security-disclosure-policy/">
                                        {sub}
                                    </ExternalLink>
                                ),
                            },
                        )}
                    </SettingsSubsectionText>
                </SettingsSubsection>
            );
        }

        /**
         * IBM CHANGES FOR BRANDING - DO NOT OVERWRITE
         *
         * START
        */
        const { messengerVersion, elementVersion, cryptoVersion } = this.getVersionInfo();
        /**
        * END
        *
        * IBM CHANGES FOR BRANDING - DO NOT OVERWRITE
        */

        return (
            <SettingsTab>
                <SettingsSection>
                    {bugReportingSection}
                    {
                    /**
                     * IBM CHANGES FOR BRANDING - DO NOT OVERWRITE
                     *
                     * START
                    */
                    }
                    {SdkConfig.get().custom_help_url && <SettingsSubsection heading={_t("common|faq")} description={faqText} />}
                    <SettingsSubsection heading={_t("setting|help_about|versions")}>
                        <SettingsSubsectionText>
                        <CopyableText getTextToCopy={this.getVersionTextToCopy}>
                        {messengerVersion}
                        <br />
                        {elementVersion}
                        <br />
                        {cryptoVersion}
                        <br />
                        </CopyableText>
                        {
                        //updateButton
                        }
                        {
                        /**
                        * END
                        *
                        * IBM CHANGES FOR BRANDING - DO NOT OVERWRITE
                        */
                        }
                        </SettingsSubsectionText>
                    </SettingsSubsection>
                    {this.renderLegal()}
                    {this.renderCredits()}
                    <SettingsSubsection heading={_t("common|advanced")}>
                        <SettingsSubsectionText>
                            {_t(
                                "setting|help_about|homeserver",
                                {
                                    homeserverUrl: this.context.getHomeserverUrl(),
                                },
                                {
                                    code: (sub) => <code>{sub}</code>,
                                },
                            )}
                        </SettingsSubsectionText>
                       {/**
                        * IBM CHANGES FOR BRANDING - DO NOT OVERWRITE
                        *
                        * START
                        */
                        SettingsStore.getValue("UIFeature.identityServer") && this.context.getIdentityServerUrl() && (
                            <SettingsSubsectionText>
                                {_t(
                                    "setting|help_about|identity_server",
                                    {
                                        identityServerUrl: this.context.getIdentityServerUrl(),
                                    },
                                    {
                                        code: (sub) => <code>{sub}</code>,
                                    },
                                )}
                            </SettingsSubsectionText>
                        )}
                        <SettingsSubsectionText>
                        {
                        /**
                        * END
                        *
                        * IBM CHANGES FOR BRANDING - DO NOT OVERWRITE
                        */
                        }
                            <details>
                                <summary className="mx_HelpUserSettingsTab_accessTokenDetails">
                                    {_t("common|access_token")}
                                </summary>
                                <strong>{_t("setting|help_about|access_token_detail")}</strong>
                                <CopyableText getTextToCopy={() => this.context.getAccessToken()}>
                                    {this.context.getAccessToken()}
                                </CopyableText>
                            </details>
                        </SettingsSubsectionText>
                        <AccessibleButton onClick={this.onClearCacheAndReload} kind="danger_outline">
                            {_t("setting|help_about|clear_cache_reload")}
                        </AccessibleButton>
                    </SettingsSubsection>
                </SettingsSection>
            </SettingsTab>
        );
    }
}
