import { useNavigate } from "react-router";
import Layout from "@/react-app/components/Layout";
import { Button } from "@/react-app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Check, Crown } from "lucide-react";

export default function UpgradePage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Upgrade to Premium
            </h1>
            <p className="text-lg text-foreground">
              Unlock advanced features and premium templates
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Free Plan</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5" />
                    <span>Access to basic card templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5" />
                    <span>Color customization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5" />
                    <span>PDF download</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5" />
                    <span>Basic support</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-6" disabled>
                  Current Plan
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden dark:border-purple-800 dark:from-purple-950/50 dark:to-pink-950/50">
              <div className="absolute top-4 right-4">
                <Crown className="w-8 h-8 text-purple-600" />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Premium Plan</CardTitle>
                <CardDescription>For professionals who need more</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$19</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-600 mt-0.5" />
                    <span className="font-medium">Everything in Free, plus:</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-600 mt-0.5" />
                    <span>Access to luxury card templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-600 mt-0.5" />
                    <span>Custom background images</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-600 mt-0.5" />
                    <span>Advanced customization tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-600 mt-0.5" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-600 mt-0.5" />
                    <span>Unlimited downloads</span>
                  </li>
                </ul>
                <Button 
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => navigate('/payment')}
                >
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
