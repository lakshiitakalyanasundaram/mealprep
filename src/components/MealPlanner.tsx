import React, { useState, Children } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, List, ChefHat, Info, Lightbulb, Utensils, Refrigerator, Apple } from "lucide-react";
import { usePreferences, MealType } from '../context/PreferencesContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PreferencesForm from './PreferencesForm';
import { sendChatMessage } from '@/services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const sectionIcons: Record<string, React.ReactNode> = {
  ingredients: <Apple className="inline mr-2 text-green-600" size={20} />,
  instructions: <Utensils className="inline mr-2 text-blue-600" size={20} />,
  tips: <Lightbulb className="inline mr-2 text-yellow-500" size={20} />,
  nutrition: <Info className="inline mr-2 text-pink-500" size={20} />,
  storage: <Refrigerator className="inline mr-2 text-cyan-600" size={20} />,
};

const highlightSection = (text: string) => {
  // Convert markdown headings to ### Heading format (no icons)
  return text
    .replace(/\*\*Ingredients:\*\*/gi, `### Ingredients`)
    .replace(/\*\*Step-by-step Instructions:\*\*/gi, `### Instructions`)
    .replace(/\*\*Instructions:\*\*/gi, `### Instructions`)
    .replace(/\*\*Tips for Success:\*\*/gi, `### Tips for Success`)
    .replace(/\*\*Nutritional Information.*\*\*/gi, `### Nutrition`)
    .replace(/\*\*Storage and Reheating Instructions:\*\*/gi, `### Storage & Reheating`);
};

function splitDays(markdown: string): { day: string, content: string }[] {
  // Try to match headings like '## Day 1', '# Day 1', or even 'Day 1'
  const regex = /(?:^|\n)(?:#+\s*)?(Day\s*\d+)[^\n]*\n/gi;
  const matches = [];
  let match;
  let lastIndex = 0;
  let lastDay = null;

  while ((match = regex.exec(markdown)) !== null) {
    if (lastDay !== null) {
      matches.push({
        day: lastDay,
        content: markdown.slice(lastIndex, match.index).trim()
      });
    }
    lastDay = match[1];
    lastIndex = regex.lastIndex;
  }
  if (lastDay !== null) {
    matches.push({
      day: lastDay,
      content: markdown.slice(lastIndex).trim()
    });
  }
  // If no days found, return the whole markdown as one box
  return matches.length ? matches : [{ day: 'Meal Plan', content: markdown }];
}

const mealIcons: Record<string, React.ReactNode> = {
  Breakfast: <Apple className="inline mr-1 text-orange-500" size={18} />, // or use a breakfast icon
  Lunch: <Utensils className="inline mr-1 text-blue-500" size={18} />, // or use a lunch icon
  Dinner: <ChefHat className="inline mr-1 text-purple-500" size={18} />,
};

function splitMeals(dayContent: string, mealTypes: MealType[]): { meal: string, content: string }[] {
  // Split by headings like '### Breakfast', '### Lunch', etc.
  const mealRegex = /(?:^|\n)(?:#+\s*)?((?:Breakfast|Lunch|Dinner))[^\n]*\n/gi;
  const matches = [];
  let match;
  let lastIndex = 0;
  let lastMeal = null;
  while ((match = mealRegex.exec(dayContent)) !== null) {
    if (lastMeal !== null) {
      matches.push({
        meal: lastMeal,
        content: dayContent.slice(lastIndex, match.index).trim()
      });
    }
    lastMeal = match[1];
    lastIndex = mealRegex.lastIndex;
  }
  if (lastMeal !== null) {
    matches.push({
      meal: lastMeal,
      content: dayContent.slice(lastIndex).trim()
    });
  }
  // Only return meals that are in the user's preferences
  return matches.filter(m => mealTypes.includes(m.meal as MealType));
}

function removeAsterisksFromSections(markdown: string, sections: string[]): string {
  for (const section of sections) {
    const regex = new RegExp(`(\\*\\*${section}:\\*\\*[\\s\\S]*?)(\\n\\n|$)`, 'gi');
    markdown = markdown.replace(regex, (match, p1, p2) => {
      const cleanContent = p1.replace(/\\*/g, '');
      return cleanContent + p2;
    });
  }
  return markdown;
}

function removeMarkdownStarsFromSpecificSections(text: string, sections: string[]) {
  for (const section of sections) {
    const regex = new RegExp(`(\\*\\*${section}\\*\\*\\n)([\\s\\S]*?)(?=\\n\\*\\*|$)`, 'g');
    text = text.replace(regex, (match, title, content) => {
      const cleanedContent = content.replace(/\\*\\*/g, ''); // remove double asterisks
      return title + cleanedContent;
    });
  }
  return text;
}

function cleanMarkdown(md: string): string {
  let cleaned = md.replace(/\[object Object\]/g, '');

  // Tips for Success
  cleaned = cleaned.replace(
    /(\*\*|__)?Tips for Success(\*\*|__)?[:\s-]*([^\n]*)/gi,
    '\n\n### Tips for Success\n$3'
  );

  // Nutrition
  cleaned = cleaned.replace(
    /(\*\*|__)?Nutrition[^\*]*?(\*\*|__)?[:\s-]*([^\n]*)/gi,
    '\n\n### Nutrition\n$3'
  );

  // Break up recipe metadata into separate lines
  cleaned = cleaned.replace(
    /(Recipe Name:[^\n]*?)\s+Short Description:/gi,
    '$1\nShort Description:'
  );
  cleaned = cleaned.replace(
    /(Short Description:[^\n]*?)\s+Total Cooking Time:/gi,
    '$1\nTotal Cooking Time:'
  );
  cleaned = cleaned.replace(
    /(Total Cooking Time:[^\n]*?)\s+Servings:/gi,
    '$1\nServings:'
  );

  // Ensure **Instructions:** or Instructions: is always on its own line
  cleaned = cleaned.replace(/(\*\*Instructions:\*\*|Instructions:)/gi, '\n\n### Instructions\n\n');

  // Remove extra blank lines
  cleaned = cleaned
    .split('\n')
    .filter(line => line.trim() !== '')
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');

  return cleaned;
}

const MealPlanner = () => {
  const [query, setQuery] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [openMeals, setOpenMeals] = useState<Record<string, string | null>>({});
  const { preferences } = usePreferences();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Please enter a meal planning query');
      return;
    }
    setLoading(true);
    try {
      const result = await sendChatMessage(query, preferences);
      setResponse(result.response);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate meal plan. Please try again.');
      setResponse('');
    } finally {
      setLoading(false);
    }
  };

  // Parse and clean days
  let days = response ? splitDays(response) : [];
  const expectedDays = preferences.mealFrequency === 'Monthly' ? 20 : 7;

  // Helper: alternate unique days, never repeat consecutively
  function buildAlternatingDays(blocks: typeof days, total: number) {
    const result = [];
    let lastIdx = -1;
    for (let i = 0; i < total; i++) {
      let idx = i % blocks.length;
      // Ensure no two consecutive days are the same
      if (idx === lastIdx) idx = (idx + 1) % blocks.length;
      result.push({
        day: `Day ${i + 1}`,
        content: blocks[idx]?.content || 'No meal plan generated for this day.'
      });
      lastIdx = idx;
    }
    return result;
  }

  if (preferences.mealFrequency === 'Weekly') {
    // Use up to 4 unique days, alternate but never repeat consecutively
    const uniqueBlocks = days.slice(0, 4);
    days = buildAlternatingDays(uniqueBlocks, expectedDays);
  } else if (preferences.mealFrequency === 'Monthly') {
    // Use up to 2 unique weeks (5 days each), alternate weeks, never repeat consecutively
    const weekBlocks = [];
    for (let w = 0; w < 2; w++) {
      weekBlocks.push(days.slice(w * 5, w * 5 + 5));
    }
    const result = [];
    let lastWeekIdx = -1;
    for (let w = 0; w < 4; w++) {
      let weekIdx = w % weekBlocks.length;
      if (weekIdx === lastWeekIdx) weekIdx = (weekIdx + 1) % weekBlocks.length;
      for (let d = 0; d < 5; d++) {
        const block = weekBlocks[weekIdx][d];
        result.push({
          day: `Day ${w * 5 + d + 1}`,
          content: block?.content || 'No meal plan generated for this day.'
        });
      }
      lastWeekIdx = weekIdx;
    }
    days = result;
  } else {
    // If not enough days, repeat previous day for alternate days (fallback)
    if (days.length < expectedDays) {
      const filledDays = [];
      for (let i = 0; i < expectedDays; i++) {
        // Always use the last available real day if not enough unique days
        const idx = i < days.length ? i : days.length - 1;
        filledDays.push({
          day: `Day ${i + 1}`,
          content: days[idx]?.content || ''
        });
      }
      days = filledDays;
    }
  }

  // Only show day boxes if at least one real meal plan is generated
  const hasRealPlan = days.some(d => d.content && !/No meal plan generated/i.test(d.content));

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <Tabs defaultValue="planner" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="planner">Meal Planner</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        <TabsContent value="planner" className="mt-4 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Ask about meal ideas, grocery lists, or ways to reduce food waste..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[100px]"
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating meal plan...
                </>
              ) : (
                'Generate Meal Plan'
              )}
            </Button>
          </form>

          {hasRealPlan && (
            <div className="space-y-8">
              {days.map((dayObj, idx) => {
                const meals = splitMeals(cleanMarkdown(dayObj.content), preferences.mealTypes);
                return (
                  <div
                    key={idx}
                    className="rounded-xl shadow-lg border-2 border-green-200 bg-white"
                  >
                    <div className="p-4 bg-green-50 rounded-t-xl border-b border-green-200 flex flex-col gap-2">
                      <span className="font-bold text-lg text-green-800">{dayObj.day}</span>
                      <div className="flex flex-wrap gap-3 items-center">
                        {meals.map((m, i) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1 text-sm font-medium">
                            {mealIcons[m.meal]}
                            {m.meal}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="divide-y divide-green-100">
                      {meals.length === 0 && (
                        <div className="p-4 text-gray-500">No meal plan generated for this day.</div>
                      )}
                      {meals.map((m, i) => (
                        <div key={i}>
                          <button
                            className="w-full text-left px-6 py-3 flex items-center gap-2 hover:bg-green-50 focus:outline-none"
                            onClick={() => setOpenMeals(prev => ({ ...prev, [dayObj.day]: prev[dayObj.day] === m.meal ? null : m.meal }))}
                            type="button"
                          >
                            <span className="font-semibold text-green-700 flex items-center gap-2">
                              {mealIcons[m.meal]} {m.meal}
                            </span>
                            <span className="ml-auto text-green-400">{openMeals[dayObj.day] === m.meal ? '▼' : '▶'}</span>
                          </button>
                          {openMeals[dayObj.day] === m.meal && (
                            <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50">
                              {(() => {
                                const noStarsText = removeMarkdownStarsFromSpecificSections(
                                  cleanMarkdown(m.content),
                                  ['Tips for Success', 'Nutrition']
                                );
                                const finalText = highlightSection(noStarsText);
                                return (
                                  <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                      h3({ node, ...props }) {
                                        const text = React.Children.toArray(props.children).join('').trim();
                                        const iconMap: Record<string, React.ReactNode> = {
                                          Ingredients: <Apple className="inline mr-2 text-green-600" size={20} />,
                                          Instructions: <Utensils className="inline mr-2 text-blue-600" size={20} />,
                                          "Tips for Success": <Lightbulb className="inline mr-2 text-yellow-500" size={20} />,
                                          Nutrition: <Info className="inline mr-2 text-pink-500" size={20} />,
                                          "Storage & Reheating": <Refrigerator className="inline mr-2 text-cyan-600" size={20} />,
                                        };
                                        const icon = iconMap[text] || null;
                                        return (
                                          <h3 className="text-lg font-semibold mt-4 mb-2 flex items-center">
                                            {icon} <span>{text}</span>
                                          </h3>
                                        );
                                      },
                                      ul({ node, ...props }) {
                                        return (
                                          <ul className="list-disc list-inside space-y-1 text-base text-gray-800">
                                            {props.children}
                                          </ul>
                                        );
                                      },
                                      li({ node, ...props }) {
                                        return (
                                          <li className="leading-relaxed">
                                            {props.children}
                                          </li>
                                        );
                                      },
                                    }}
                                  >
                                    {finalText}
                                  </ReactMarkdown>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
        <TabsContent value="preferences">
          <PreferencesForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MealPlanner;
