export {
  getContactToEmail,
  getResendApiKey,
  getResendFromEmail,
} from "./config";
export { handleLeadRequest } from "./handle-lead";
export { sendLeadEmail } from "./send";
export {
  buildLeadMail,
  subjectForLead,
  type LeadMailContent,
  type LeadType,
  type SendLeadResult,
} from "./templates";
