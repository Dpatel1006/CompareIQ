'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PreferencesPanelProps {
  preferences: {
    budget?: string;
    priorities?: string[];
    useCase?: string;
  };
  onChange: (preferences: { budget?: string; priorities?: string[]; useCase?: string }) => void;
}

const PRIORITY_OPTIONS = [
  'Performance',
  'Value for Money',
  'Design',
  'Durability',
  'Features',
  'Battery Life',
  'Camera Quality',
  'Ease of Use',
];

export function PreferencesPanel({ preferences, onChange }: PreferencesPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const togglePriority = (priority: string) => {
    const current = preferences.priorities || [];
    const updated = current.includes(priority)
      ? current.filter((p) => p !== priority)
      : [...current, priority];
    onChange({ ...preferences, priorities: updated });
  };

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-900">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg"
      >
        <span>Preferences (Optional)</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budget">Budget</Label>
            <Input
              id="budget"
              placeholder="e.g., under $500"
              value={preferences.budget || ''}
              onChange={(e) => onChange({ ...preferences, budget: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Priorities</Label>
            <div className="grid grid-cols-2 gap-2">
              {PRIORITY_OPTIONS.map((priority) => (
                <label
                  key={priority}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <Checkbox
                    checked={(preferences.priorities || []).includes(priority)}
                    onCheckedChange={() => togglePriority(priority)}
                  />
                  <span className="text-gray-700 dark:text-gray-300">{priority}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="useCase">Use Case</Label>
            <Textarea
              id="useCase"
              placeholder="e.g., for a college student who needs a laptop for coding and note-taking"
              value={preferences.useCase || ''}
              onChange={(e) => onChange({ ...preferences, useCase: e.target.value })}
              rows={2}
            />
          </div>
        </div>
      )}
    </div>
  );
}
