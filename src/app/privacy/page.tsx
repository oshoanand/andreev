
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
       <Button asChild variant="outline" className="mb-8">
        <Link href="/register">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Registration
        </Link>
      </Button>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-center">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-center">Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-xl font-semibold font-headline">1. Information We Collect</h2>
          <p>We collect information that you provide directly to us when you create an account, place an order, or communicate with us. This may include your name, email address, shipping address, phone number, and payment information (though we do not store full payment card details).</p>
          <p>We may also automatically collect certain information when you visit our site, such as your IP address, browser type, operating system, and information about your browsing behavior through cookies and similar technologies.</p>

          <h2 className="text-xl font-semibold font-headline">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Process your orders and manage your account.</li>
            <li>Communicate with you about your orders, new products, and promotions (if you opt-in).</li>
            <li>Improve our website and services.</li>
            <li>Prevent fraud and ensure the security of our site.</li>
            <li>Comply with legal obligations.</li>
          </ul>

          <h2 className="text-xl font-semibold font-headline">3. Sharing Your Information</h2>
          <p>We do not sell or rent your personal information to third parties. We may share your information with trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. Examples include payment processors and shipping companies.</p>
          <p>We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.</p>
          
          <h2 className="text-xl font-semibold font-headline">4. Data Security</h2>
          <p>We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.</p>

          <h2 className="text-xl font-semibold font-headline">5. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information. You can usually do this through your account settings or by contacting us directly. You may also have other rights depending on your jurisdiction.</p>

          <h2 className="text-xl font-semibold font-headline">6. Cookies</h2>
          <p>Our website uses "cookies" to enhance your experience and gather information about visitors and visits to our websites. You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies through your browser settings.</p>

          <h2 className="text-xl font-semibold font-headline">7. Changes to This Privacy Policy</h2>
          <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page. You are advised to review this privacy policy periodically for any changes.</p>

          <h2 className="text-xl font-semibold font-headline">8. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at [Your Contact Email/Link].</p>

          <p className="text-center mt-8">This is a placeholder document for a fictional e-commerce store. Replace with your actual privacy policy.</p>
        </CardContent>
      </Card>
    </div>
  );
}
