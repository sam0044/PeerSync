import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: <Share2 className="h-6 w-6" />,
    title: "Instant Sharing",
    description: "Share files seamlessly with peers in real-time"
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Secure Transfer",
    description: "End-to-end encryption for your file transfers"
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Lightning Fast",
    description: "Optimized for speed and reliability"
  }
];

export function Features() {
  return (
    <section className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {features.map((feature, index) => (
        <Card key={index} className="text-center">
          <CardHeader>
            <div className="mx-auto rounded-full bg-primary/10 p-3 w-fit mb-4">
              {feature.icon}
            </div>
            <CardTitle className="text-xl">{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}