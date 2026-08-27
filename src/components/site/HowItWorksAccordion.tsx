"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import { iconFor } from "@/lib/icons";
import { pick, type Locale } from "@/i18n/config";
import type { ProcessStage, ProcessStep } from "@/lib/types";

export default function HowItWorksAccordion({
  stages,
  steps,
  locale,
}: {
  stages: ProcessStage[];
  steps: ProcessStep[];
  locale: Locale;
}) {
  const [openStage, setOpenStage] = useState<number | null>(stages[0]?.stage_number ?? null);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {stages.map((stage, stageIndex) => {
        const stageSteps = steps.filter((step) => step.stage_number === stage.stage_number);
        const StageIcon = iconFor(stage.icon);
        const expanded = openStage === stage.stage_number;

        return (
          <Reveal key={stage.id} delay={stageIndex * 60}>
            <div className="surface-card overflow-hidden p-0">
              <button
                type="button"
                onClick={() => setOpenStage(expanded ? null : stage.stage_number)}
                aria-expanded={expanded}
                className="flex w-full items-center gap-4 p-5 text-start"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-trust-blue to-china-red text-white">
                  <StageIcon className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block text-xs font-bold uppercase tracking-widest text-china-red">
                    {String(stage.stage_number).padStart(2, "0")}
                  </span>
                  <span className="block text-lg font-extrabold text-trust-blue">
                    {pick(stage, "title", locale)}
                  </span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-charcoal/40 transition-transform ${expanded ? "rotate-180" : ""}`}
                />
              </button>

              {expanded && (
                <div className="border-t border-trust-blue/8 p-5">
                  <p className="text-sm leading-relaxed text-charcoal/70">
                    {pick(stage, "description", locale)}
                  </p>
                  <ol className="mt-5 space-y-4">
                    {stageSteps.map((step, index) => {
                      const StepIcon = iconFor(step.icon);
                      return (
                        <li key={step.id} className="flex gap-4">
                          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-trust-blue/10 text-trust-blue">
                            <StepIcon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-charcoal/45">
                              {String(index + 1).padStart(2, "0")}
                            </p>
                            <p className="font-extrabold text-trust-blue">
                              {pick(step, "title", locale)}
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-charcoal/70">
                              {pick(step, "description", locale)}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
