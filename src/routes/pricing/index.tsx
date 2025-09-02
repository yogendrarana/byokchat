import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components//ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components//ui/select';
import { BillingCycle, type TBillingCycle } from '@/constants/billing';
import { creditOptions, Plan, pricing } from '@/config/pricing';

export const Route = createFileRoute('/pricing/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [billingCycle, setBillingCycle] = useState<TBillingCycle>(BillingCycle.MONTHLY);
  const [selectedCredits, setSelectedCredits] = useState<Record<string, number>>({
    starter: creditOptions.starter[0],
    pro: creditOptions.pro[0],
    agency: creditOptions.agency[0],
  });

  const getPrice = (credits: number, billingCycle: TBillingCycle, basePlan: string) => {
    const yearlyDiscount = billingCycle === BillingCycle.YEARLY ? 0.8 : 1.0;
    let basePrice;

    if (basePlan === Plan.STARTER) basePrice = 19 + (credits - 40) * 0.4;
    else if (basePlan === Plan.PRO) basePrice = 49 + (credits - 120) * 0.35;
    else if (basePlan === Plan.AGENCY) basePrice = 129 + (credits - 300) * 0.3;
    else basePrice = 0;

    return Math.round(basePrice * yearlyDiscount);
  };

  return (
    <section id="pricing" className="container py-16 md:py-24">
      <div className="mx-auto text-center mb-16 space-y-2">
        <h2 className="text-3xl font-bold md:text-4xl text-foreground">Pricing That Scales With You</h2>
        <p className="text-lg text-muted-foreground">
          Whether you're experimenting or scaling production, choose the right amount of video credits for your needs.
        </p>

        <div className="p-1 mt-4 border inline-flex items-center gap-4 bg-muted rounded-sm text-muted-foreground">
          <Button
            variant={billingCycle === BillingCycle.MONTHLY ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setBillingCycle(BillingCycle.MONTHLY)}
            className={cn({
              'bg-background text-foreground shadow-sm hover:bg-background': billingCycle === BillingCycle.MONTHLY,
            })}
          >
            Monthly
          </Button>
          <Button
            variant={billingCycle === BillingCycle.YEARLY ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setBillingCycle(BillingCycle.YEARLY)}
            className={cn({
              'bg-background text-foreground shadow-sm hover:bg-background': billingCycle === BillingCycle.YEARLY,
            })}
          >
            Yearly
            <Badge variant="secondary" className="ml-2 text-xs bg-emerald-100 text-emerald-700">
              Save 20%
            </Badge>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pricing.map(plan => {
          const isFree = plan.id === 'free';
          const isRecommended = plan.recommended;
          const credits = selectedCredits[plan.id] ?? plan.baseCredits;
          const price = getPrice(credits, billingCycle, plan.id);
          const bgClass = plan.color === 'emerald' ? 'from-emerald-50' : 'from-muted/50';
          const planCreditOptions = creditOptions[plan.id] || [];

          return (
            <Card
              key={plan.id}
              className={cn(
                'rounded-sm shadow-none relative overflow-hidden bg-gradient-to-br',
                bgClass,
                'to-background shadow-md flex flex-col h-full',
              )}
            >
              {isRecommended && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-emerald-600 text-white">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 ">
                  <CardTitle className="text-xl text-foreground">{plan.name}</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-4 flex-1 flex flex-col">
                {!isFree && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Credits per month:</label>
                    <Select
                      value={credits.toString()}
                      onValueChange={value => setSelectedCredits({ ...selectedCredits, [plan.id]: parseInt(value) })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select credits" />
                      </SelectTrigger>
                      <SelectContent>
                        {planCreditOptions.map((c: number) => (
                          <SelectItem key={c} value={c.toString()}>
                            {c.toLocaleString()} credits
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="text-center py-4">
                  {isFree ? (
                    <>
                      <div className="text-3xl font-bold text-foreground">Free</div>
                      <div className="text-xs text-muted-foreground mt-1">{plan.credits} credits/month</div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-center items-baseline gap-2">
                        <span className="text-3xl font-bold text-foreground">${price}</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      {billingCycle === BillingCycle.YEARLY && (
                        <div className="text-sm text-emerald-600 mt-1">
                          Billed yearly • Save ${getPrice(credits, BillingCycle.MONTHLY, plan.id) - price}/month
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">{credits.toLocaleString()} video ads included</div>
                    </>
                  )}
                </div>

                <div className="space-y-3 flex-1">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div
                        className={cn(
                          'h-4 w-4 rounded-full flex items-center justify-center',
                          plan.color === 'emerald' ? 'bg-emerald-600' : 'bg-muted-foreground',
                        )}
                      >
                        <Check className="h-2.5 w-2.5 text-white" />
                      </div>
                      <span className="text-foreground text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-4">
                  <Button
                    className={cn(
                      'w-full',
                      isFree
                        ? 'bg-muted-foreground hover:bg-muted-foreground/90'
                        : isRecommended
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-foreground hover:bg-foreground/90',
                    )}
                  >
                    {isFree ? 'Get Started Free' : `Start ${plan.name}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-16">
        <p className="text-muted-foreground mb-4">Need more credits or custom integrations?</p>
        <Button variant="outline" className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50">
          Contact Sales for Custom Plan
        </Button>
      </div>
    </section>
  );
}
