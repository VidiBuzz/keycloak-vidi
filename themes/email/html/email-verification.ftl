<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - Candid Studios</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f7;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f7; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08); overflow: hidden;">

                    <!-- Header with gradient -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 48px 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                                Welcome to Candid Studios
                            </h1>
                            <p style="margin: 12px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 400;">
                                Let's verify your email address
                            </p>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 48px 40px;">
                            <p style="margin: 0 0 24px 0; color: #1d1d1f; font-size: 16px; line-height: 1.6;">
                                Hi <strong>${user.firstName!"there"}</strong>,
                            </p>

                            <p style="margin: 0 0 24px 0; color: #424245; font-size: 16px; line-height: 1.6;">
                                Your Candid Studios account has been created! To get started with accessing your media files and uploading projects, please verify your email address by clicking the button below.
                            </p>

                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${link}" style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                                            Verify Email Address
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Alternative Link -->
                            <p style="margin: 24px 0; color: #86868b; font-size: 14px; line-height: 1.6;">
                                If the button doesn't work, copy and paste this link into your browser:
                            </p>
                            <p style="margin: 0 0 24px 0; padding: 16px; background-color: #f5f5f7; border-radius: 8px; color: #424245; font-size: 13px; word-break: break-all; font-family: 'Courier New', monospace;">
                                ${link}
                            </p>

                            <!-- Expiration Notice -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0; border-left: 4px solid #667eea; background-color: #f9fafb; border-radius: 8px;">
                                <tr>
                                    <td style="padding: 20px 24px;">
                                        <p style="margin: 0; color: #424245; font-size: 14px; line-height: 1.6;">
                                            ⏰ <strong>Important:</strong> This verification link will expire in <strong>12 hours</strong> for security purposes.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Security Notice -->
                            <p style="margin: 24px 0 0 0; color: #86868b; font-size: 14px; line-height: 1.6;">
                                If you didn't create this account, you can safely ignore this email.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 40px; background-color: #f9fafb; border-top: 1px solid #e5e5e7;">
                            <p style="margin: 0 0 8px 0; color: #1d1d1f; font-size: 16px; font-weight: 600;">
                                Candid Studios
                            </p>
                            <p style="margin: 0 0 16px 0; color: #86868b; font-size: 14px; line-height: 1.6;">
                                Professional media management for your creative projects
                            </p>

                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 16px 0 0 0;">
                                <tr>
                                    <td style="color: #86868b; font-size: 13px;">
                                        <p style="margin: 0 0 8px 0;">
                                            Need help? <a href="mailto:support@candidstudios.net" style="color: #667eea; text-decoration: none;">support@candidstudios.net</a>
                                        </p>
                                        <p style="margin: 0; color: #c7c7cc; font-size: 12px;">
                                            © ${.now?string('yyyy')} Candid Studios. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
