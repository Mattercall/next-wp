import { EmbeddedPage, buildEmbeddedPageMetadata } from "@/components/embedded-page";

const accountUrl =
  process.env.ACCOUNT__URL ?? process.env.ACCOUNT_URL ?? process.env.NEXT_PUBLIC_ACCOUNT_URL;

const accountUrlEnvKeys = ["ACCOUNT__URL", "ACCOUNT_URL", "NEXT_PUBLIC_ACCOUNT_URL"];

export const metadata = buildEmbeddedPageMetadata(
  "Account",
  "Manage your account inside the embedded account experience.",
  "/account"
);

export default function AccountPage() {
  return (
    <EmbeddedPage url={accountUrl} missingEnvVarNames={accountUrlEnvKeys} />
  );
}
