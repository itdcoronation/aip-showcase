"use client";
import { cn } from "@/lib/utils";

interface Stage {
  key: string;
  stage: number;
  title: string;
}

interface JointStepsProps {
  stages: Stage[];
  stage: Stage;
  onChangeStage: (data: Stage) => void;
}

const JointSteps: React.FC<JointStepsProps> = ({
  stages,
  stage,
  onChangeStage,
}) => {
  return (
    <>
      <div className="border-y border-stroke-primary flex gap-4 mb-10">
        {stages.map((item) => (
          <span
            onClick={() => onChangeStage(item)}
            key={item.key}
            className={cn(
              "py-4 block text-txt-tertiary !text-p3 -mb-[1px] border-b",
              stage.stage === item.stage
                ? "text-txt-primary !border-stroke-inv"
                : "!border-transparent"
            )}
          >
            {item.title}
          </span>
        ))}
      </div>
    </>
  );
};

export { JointSteps };
