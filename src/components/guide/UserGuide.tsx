import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, SkipForward } from 'lucide-react';

interface UserGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GuideStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for highlighting
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const guideSteps: GuideStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Hero Builder!',
    description: 'This guide will help you create professional hero templates. Let\'s get started!',
  },
  {
    id: 'components',
    title: 'Component Library',
    description: 'Drag components from the left sidebar to your canvas. Available components include text, images, buttons, and rows.',
    target: '.components-sidebar',
    position: 'right',
  },
  {
    id: 'canvas',
    title: 'Canvas Area',
    description: 'This is your main workspace where you\'ll build your hero template. Click and drag components to position them.',
    target: '.canvas-area',
    position: 'bottom',
  },
  {
    id: 'properties',
    title: 'Properties Panel',
    description: 'Select any component to edit its properties in the right panel. You can change colors, fonts, sizes, and more.',
    target: '.properties-panel',
    position: 'left',
  },
  {
    id: 'layers',
    title: 'Layers Panel',
    description: 'Manage your components in the layers panel at the bottom. Reorder, hide, or lock layers as needed. You can also add new layers by clicking the + button.',
    target: '.layers-panel',
    position: 'top',
  },
  {
    id: 'responsive',
    title: 'Responsive Design',
    description: 'Switch between desktop and mobile views using the toggle in the header. Each view can have different layouts. You can also add new views by clicking the + button.',
    target: '.view-toggle',
    position: 'bottom',
  },
  {
    id: 'preview',
    title: 'Preview & Export',
    description: 'Use the Preview button to see how your hero looks on different devices, or Export to get the HTML code.',
    target: '.action-buttons',
    position: 'bottom',
  },
  {
    id: 'shortcuts',
    title: 'Keyboard Shortcuts',
    description: 'Use Ctrl+Z to undo, Ctrl+Y to redo, and other shortcuts for faster workflow. Press ? anytime to see all shortcuts. You can also use the keyboard shortcuts to navigate through the guide.',
    target: '.header',
    position: 'bottom',
  },
  {
    id: 'library',
    title: 'Template Library',
    description: 'Save your templates and access them later from the Library. You can also import and export templates. You can also create new templates by clicking the + button.',
    target: '.library-button',
    position: 'bottom',
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'You now know the basics of Hero Builder. Start creating your first hero by dragging a component to the canvas!',
  },
];

export const UserGuide: React.FC<UserGuideProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null);

  const currentGuideStep = guideSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === guideSteps.length - 1;

  const nextStep = () => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startAutoPlay = () => {
    setIsPlaying(true);
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= guideSteps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);
    setAutoPlayInterval(interval);
  };

  const stopAutoPlay = () => {
    setIsPlaying(false);
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
    }
  };

  const skipToEnd = () => {
    setCurrentStep(guideSteps.length - 1);
    stopAutoPlay();
  };

  // Cleanup interval on unmount
  React.useEffect(() => {
    return () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    };
  }, [autoPlayInterval]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-sm font-bold">
              {currentStep + 1}
            </div>
            <h2 className="text-xl font-semibold">User Guide</h2>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Auto-play controls */}
            <button
              onClick={isPlaying ? stopAutoPlay : startAutoPlay}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              title={isPlaying ? 'Pause auto-play' : 'Start auto-play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            
            <button
              onClick={skipToEnd}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              title="Skip to end"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {currentGuideStep.title}
            </h3>
            
            <p className="text-gray-600 leading-relaxed">
              {currentGuideStep.description}
            </p>
            
            {/* Progress indicator */}
            <div className="pt-4">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Step {currentStep + 1} of {guideSteps.length}</span>
                <span>{Math.round(((currentStep + 1) / guideSteps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / guideSteps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={isFirstStep}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              isFirstStep
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          
          <div className="flex gap-2">
            {guideSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-blue-500'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={isLastStep ? onClose : nextStep}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {isLastStep ? 'Finish' : 'Next'}
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}; 