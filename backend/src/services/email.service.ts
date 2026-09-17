import { Resend } from "resend";
import { RESEND_API_KEY, APP_NAME, APP_EMAIL } from "../configs/env.config.js";

const resend = new Resend(RESEND_API_KEY);
const EMAIL_FROM = `${APP_NAME} Support <${APP_EMAIL}>`;

const EmailService = {
    sendEmail: async (to: string, subject: string, html: string) => {
        try {
            const data = await resend.emails.send({
                from: EMAIL_FROM,
                to: [to],
                subject,
                html,
            });
            return data;
        } catch (error) {
            console.error("EmailService failed to deliver mail via Resend:", error);
            return null;
        }
    },

    sendEmailWithAttachment: async (
        to: string,
        subject: string,
        html: string,
        attachments: any[],
    ) => {
        try {
            const data = await resend.emails.send({
                from: EMAIL_FROM,
                to: [to],
                subject,
                html,
                attachments: attachments.map((att) => ({
                    filename: att.filename || att.name,
                    content: typeof att.content === "string" 
                        ? Buffer.from(att.content) 
                        : att.content,
                })),
            });
            return data;
        } catch (error) {
            console.error("EmailService failed to deliver mail with attachment via Resend:", error);
            return null;
        }
    },
};

export default EmailService;