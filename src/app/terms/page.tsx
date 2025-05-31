
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
          <CardTitle className="text-3xl font-headline text-center">Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-center">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold font-headline">1. Introduction</h2>
          <p>Welcome to Shopify Mini! These terms and conditions outline the rules and regulations for the use of Shopify Mini's Website, located at [Your Website URL]. By accessing this website we assume you accept these terms and conditions. Do not continue to use Shopify Mini if you do not agree to take all of the terms and conditions stated on this page.</p>

          <h2 className="text-xl font-semibold font-headline">2. Intellectual Property Rights</h2>
          <p>Other than the content you own, under these Terms, Shopify Mini and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.</p>

          <h2 className="text-xl font-semibold font-headline">3. Restrictions</h2>
          <p>You are specifically restricted from all of the following:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Publishing any Website material in any other media;</li>
            <li>Selling, sublicensing and/or otherwise commercializing any Website material;</li>
            <li>Publicly performing and/or showing any Website material;</li>
            <li>Using this Website in any way that is or may be damaging to this Website;</li>
            <li>Using this Website in any way that impacts user access to this Website;</li>
            <li>Using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity;</li>
            <li>Engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website;</li>
            <li>Using this Website to engage in any advertising or marketing.</li>
          </ul>
          <p>Certain areas of this Website are restricted from being access by you and Shopify Mini may further restrict access by you to any areas of this Website, at any time, in absolute discretion. Any user ID and password you may have for this Website are confidential and you must maintain confidentiality as well.</p>

          <h2 className="text-xl font-semibold font-headline">4. Your Content</h2>
          <p>In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant Shopify Mini a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media. Your Content must be your own and must not be invading any third-party's rights. Shopify Mini reserves the right to remove any of Your Content from this Website at any time without notice.</p>

          <h2 className="text-xl font-semibold font-headline">5. No warranties</h2>
          <p>This Website is provided “as is,” with all faults, and Shopify Mini express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you.</p>

          <h2 className="text-xl font-semibold font-headline">6. Limitation of liability</h2>
          <p>In no event shall Shopify Mini, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. Shopify Mini, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.</p>

          <h2 className="text-xl font-semibold font-headline">7. Indemnification</h2>
          <p>You hereby indemnify to the fullest extent Shopify Mini from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these Terms.</p>

          <h2 className="text-xl font-semibold font-headline">8. Severability</h2>
          <p>If any provision of these Terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein.</p>

          <h2 className="text-xl font-semibold font-headline">9. Variation of Terms</h2>
          <p>Shopify Mini is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis.</p>

          <h2 className="text-xl font-semibold font-headline">10. Governing Law & Jurisdiction</h2>
          <p>These Terms will be governed by and interpreted in accordance with the laws of the State of [Your State/Country], and you submit to the non-exclusive jurisdiction of the state and federal courts located in [Your State/Country] for the resolution of any disputes.</p>
          
          <p className="text-center mt-8">This is a placeholder document for a fictional e-commerce store. Replace with your actual terms and conditions.</p>
        </CardContent>
      </Card>
    </div>
  );
}
