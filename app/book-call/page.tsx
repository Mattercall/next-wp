import type { Metadata } from "next";
import { BookCallPage } from "@/components/book-call/book-call-page";

export const metadata: Metadata = {
  title: "Book a 30-min Growth Audit",
};

export default function BookCall() {
  return <BookCallPage />;
}
