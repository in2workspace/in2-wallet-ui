# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.6.4](https://github.com/in2workspace/in2-wallet-ui/releases/tag/v1.6.4)
### Changed
- Unsigned credentials are now automaticly updated if issuer has signed them
- Changed signature button for an info button when credential is unsigned

## [v1.6.3](https://github.com/in2workspace/in2-wallet-ui/releases/tag/v1.6.3)
### Fixed
- Load translations on initialization

## [v1.6.2](https://github.com/in2workspace/in2-wallet-ui/releases/tag/v1.6.2)
### Fixed
- Camera selector
- Deactivate camera when switching fast between tabs

## [v1.6.1](https://github.com/in2workspace/in2-wallet-ui/releases/tag/v1.6.1)
### Added
- Added customized colors for navbar and logo.

## [v1.5.0](https://github.com/in2workspace/in2-wallet-ui/releases/tag/v1.5.0)
### Added
- New route to execute same-device credential issuance workflow.
- Timeout counter added to "Enter PIN" popup
- More informative messages in case of error in the process of sending PIN to get credential

## [v1.4.0](https://github.com/in2workspace/in2-wallet-ui/releases/tag/v1.4.0)
### Changed
- Refactor architecture to standalone.
- Changed callback page design.
### Fixed
- Fixed the persistent callback page when state is invalid or other reasons.
- Fixed routing issues.
- Fixed some styles.

## [v1.3.7](https://github.com/in2workspace/in2-wallet-ui/releases/tag/v1.3.7)
### Fixed
- Added clean refresh to logout.

## [v1.3.6](https://github.com/in2workspace/in2-wallet-ui/releases/tag/v1.3.6)
### Fixed
- Add expired view for credentials when the credential is expired.

## [v1.3.5](https://github.com/in2workspace/in2-wallet-ui/releases/tag/v1.3.5)
### Fixed
- Successful login and Error messages style.
### Updated
- Credential added message slyle.

## [v1.3.4](https://github.com/in2workspace/in2-wallet-ui/releases/tag/v1.3.4)
### Fixed
- Refresh credentials list after deleting credential.
### Updated
- No credentials and Settings views slyle.

## [v1.3.3]
### Fixed
- The Error popup is shown when the user has no credentials.

## [v1.3.2] - ()
### Fixed
- The Error popup is shown when the user has no credentials.
- Expiration messages of credentials view are hidden

## [v1.3.1] - ()
### Fixed
- Error popup isn't shown when an already used login QR is used.

## [v1.3.0] - ()
### Added
- Pop up error message on unsuccessful login.
### Updated
- Update an Angular and scanner version.
### Fixed
- Translations
- Multiple Vcs send.
- Camera remains activated when leaving scanner page.

## [v1.2.0] - (https://github.com/in2workspace/in2-wallet-ui/releases/tag/v1.2.0)
### Added
- New endpoint for credential retrieval.
- User alerts for credential status.
- Pop-up dialogs for user interactions.
- Improved accessibility for QR components.
### Fixed
- Error handling for 202 and 204 status codes.
- Default camera selection issues.
- Text corrections for better translations.
### Updated
- Refined page refresh and redirection logic.
- Enhanced button behavior and UI components.

## [1.1.0] - (https://github.com/in2workspace/wallet-ui/releases/tag/v1.1.0)
### Added
- New oidc login connection config.
- Support for GitHub Actions for CI/CD.
- Added SonarCloud for code quality.
- Improved OIDC compatibility.
- Websocket connection.
- Ebsi implementation.
- CBOR presentation Credential support.
### Fixed
- UI/UX issues.
- SonarCloud issues.
- Error handling issues.
- Translation issues.
- SonarCloud issues.
### Updated
- Verifiable Credential Interface.
### Deleted
- Registration
- User DID management

## [1.0.0](https://github.com/in2workspace/wallet-ui/releases/tag/v1.0.0) - 2023-11-21
### Added
- User registration
- User login
- User logout
- User QR Scanning
- User DID management
- User Verifiable Credentials management
- User Preferred Language management
- User preferred Scanning Camera management
