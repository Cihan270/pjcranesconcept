import { Reveal } from "@/components/shared/Reveal";
import { ServiceFeatureBlock } from "@/components/services/ServiceFeatureBlock";

type Feature = {
  key: string;
  title: string;
  body: string;
};

type ServiceFeaturesSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  titleId: string;
  features: Feature[];
};

export function ServiceFeaturesSection({
  eyebrow,
  title,
  body,
  titleId,
  features,
}: ServiceFeaturesSectionProps) {
  return (
    <section
      className="border-b border-line bg-background"
      aria-labelledby={titleId}
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 py-12 md:px-8 md:py-14 lg:px-12 lg:py-16">
        <Reveal className="mb-10 max-w-xl space-y-3">
          <p className="font-heading text-xs font-semibold tracking-[0.22em] text-brand uppercase">
            {eyebrow}
          </p>
          <h2
            id={titleId}
            className="font-heading text-3xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {title}
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {body}
          </p>
        </Reveal>

        <Reveal delay={0.04}>
          <div className="border-b border-line">
            {features.map((feature, index) => (
              <ServiceFeatureBlock
                key={feature.key}
                index={index + 1}
                title={feature.title}
                body={feature.body}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
