import { FeedbackModal } from "@/components/modals/feedback-modal";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  ReactElement,
} from "react";

interface FeedbackState {
  description?: string;
  showFeedback: boolean;
}

interface ModalContextType {
  handleFeedbackState: (data: FeedbackState) => void;
  feedbackState: FeedbackState;
}

const defaultValue: ModalContextType = {
  feedbackState: { showFeedback: false, description: undefined },
  handleFeedbackState: () => {},
};

export const ModalContext = createContext<ModalContextType>(defaultValue);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({
  children,
}: ModalProviderProps): ReactElement => {
  const [feedbackState, setFeedbackState] = useState<FeedbackState>({
    showFeedback: false,
    description: undefined,
  });

  const handleFeedbackState = (data: FeedbackState) => {
    setFeedbackState(data);
  };

  return (
    <ModalContext.Provider
      value={{
        feedbackState,
        handleFeedbackState,
      }}
    >
      {children}
      <FeedbackModal
        close={() =>
          setFeedbackState({ showFeedback: false, description: undefined })
        }
        show={feedbackState.showFeedback}
        description={feedbackState.description}
      />
    </ModalContext.Provider>
  );
};
