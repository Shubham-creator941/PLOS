import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

import { PageHeader } from '@/widgets';
import { Button } from '@/primitives';
import { Input } from '@/primitives';
import { Textarea } from '@/primitives';
import { Select } from '@/primitives';

import { RadioGroup } from '@/primitives';
import { Card, CardContent } from '@/primitives';

// ==========================================
// Zod Schema
// ==========================================
const goalSetupSchema = z.object({
 name: z.string().min(2, 'Name must be at least 2 characters'),
 role: z.string().min(2, 'Role is required'),
 skillLevel: z.string().min(1, 'Skill level is required'),
 goal: z.string().min(5, 'Learning goal must be at least 5 characters'),
 excitement: z.string().optional(),
 why: z.string().min(20, 'Please write at least 20 characters about your motivation'),
 identity: z.string().min(5, 'Identity must be at least 5 characters'),
 hoursPerWeek: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 1, 'Must commit at least 1 hour per week'),
 preferredTime: z.string().min(1, 'Please select a preferred learning time'),
 sessionDuration: z.string(),
 targetDate: z.string().refine((dateStr) => {
 const selectedDate = new Date(dateStr);
 const today = new Date();
 today.setHours(0, 0, 0, 0);
 return selectedDate > today;
 }, { message: 'Target completion date must be in the future' }),
 learningStyles: z.array(z.string()).min(1, 'Please select at least one learning style'),
});

type GoalSetupFormValues = z.infer<typeof goalSetupSchema>;

const TOTAL_STEPS = 6;

export const GoalSetup: React.FC = () => {
 const navigate = useNavigate();
 const [currentStep, setCurrentStep] = useState(1);

 const {
 register,
 control,
 handleSubmit,
 trigger,
 watch,
 formState: { errors, isValid },
 } = useForm<GoalSetupFormValues>({
 resolver: zodResolver(goalSetupSchema),
 mode: 'onChange',
 defaultValues: {
 name: '',
 role: '',
 skillLevel: '',
 goal: '',
 excitement: '',
 why: '',
 identity: '',
 hoursPerWeek: '',
 preferredTime: '',
 sessionDuration: '30 Minutes',
 targetDate: '',
 learningStyles: [],
 },
 });

 const nextStep = async () => {
 let fieldsToValidate: (keyof GoalSetupFormValues)[] = [];
 if (currentStep === 1) fieldsToValidate = ['name', 'role', 'skillLevel'];
 if (currentStep === 2) fieldsToValidate = ['goal', 'excitement'];
 if (currentStep === 3) fieldsToValidate = ['why'];
 if (currentStep === 4) fieldsToValidate = ['identity'];
 if (currentStep === 5) fieldsToValidate = ['hoursPerWeek', 'preferredTime', 'sessionDuration', 'targetDate'];
 if (currentStep === 6) fieldsToValidate = ['learningStyles'];

 const isStepValid = await trigger(fieldsToValidate);
 if (isStepValid) {
 setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS + 1));
 }
 };

 const prevStep = () => {
 setCurrentStep((prev) => Math.max(prev - 1, 1));
 };

 const onSubmit = (data: GoalSetupFormValues) => {
 console.log('Final Data:', data);
 // In a real app, make API call here
 navigate('/dashboard');
 };

 const progressPercentage = (currentStep / (TOTAL_STEPS + 1)) * 100;

 return (
 <div className="mx-auto max-w-3xl py-8">
 {/* Progress Indicator */}
 <div className="mb-12">
 <div className="mb-2 flex items-center justify-between text-sm font-medium text-text-muted">
 <span>Step {currentStep} of {TOTAL_STEPS + 1}</span>
 <span>{Math.round(progressPercentage)}%</span>
 </div>
 <div className="h-2 w-full overflow-hidden rounded-full bg-surface-active ">
 <div
 className="h-full bg-primary-600 transition-all duration-500 ease-in-out "
 style={{ width: `${progressPercentage}%` }}
 />
 </div>
 </div>

 <div className="relative min-h-[400px]">
 {/* Animated Wrapper for steps */}
 <div key={currentStep} className="animate-[fade-in_0.5s_ease-out]">
 <form onSubmit={handleSubmit(onSubmit)}>
 {currentStep === 1 && (
 <StepOne register={register} errors={errors} />
 )}
 {currentStep === 2 && (
 <StepTwo register={register} errors={errors} />
 )}
 {currentStep === 3 && (
 <StepThree register={register} errors={errors} />
 )}
 {currentStep === 4 && (
 <StepFour register={register} errors={errors} />
 )}
 {currentStep === 5 && (
 <StepFive register={register} errors={errors} control={control} />
 )}
 {currentStep === 6 && (
 <StepSix errors={errors} control={control} />
 )}
 {currentStep === 7 && (
 <FinalReview formData={watch()} />
 )}

 {/* Navigation Actions */}
 <div className="mt-12 flex items-center justify-between border-t border-border pt-6 ">
 {currentStep > 1 ? (
 <Button type="button" variant="ghost" onClick={prevStep}>
 <ArrowLeft className="mr-2 h-4 w-4" /> Back
 </Button>
 ) : (
 <div />
 )}

 {currentStep <= TOTAL_STEPS ? (
 <Button type="button" size="lg" onClick={nextStep} className="min-w-[120px]">
 Continue <ArrowRight className="ml-2 h-4 w-4" />
 </Button>
 ) : (
 <Button type="submit" size="lg" className="min-w-[120px]" disabled={!isValid}>
 Build My Learning System <CheckCircle2 className="ml-2 h-4 w-4" />
 </Button>
 )}
 </div>
 </form>
 </div>
 </div>
 </div>
 );
};

// ==========================================
// Step Components
// ==========================================

const StepOne = ({ register, errors }: any) => (
 <div className="space-y-8">
 <PageHeader title="Who are you?" description="Let's personalize your learning experience." />
 <div className="space-y-6">
 <Input
 label="Name"
 placeholder="e.g. Alex"
 {...register('name')}
 error={errors.name?.message}
 />
 <Input
 label="Current Role / Student"
 placeholder="e.g. Computer Science Student"
 {...register('role')}
 error={errors.role?.message}
 />
 <Select
 label="Current Skill Level"
 options={[
 { label: 'Select Level...', value: '' },
 { label: 'Beginner', value: 'beginner' },
 { label: 'Intermediate', value: 'intermediate' },
 { label: 'Advanced', value: 'advanced' },
 ]}
 {...register('skillLevel')}
 error={errors.skillLevel?.message}
 />
 </div>
 </div>
);

const StepTwo = ({ register, errors }: any) => (
 <div className="space-y-8">
 <PageHeader title="What do you want to achieve?" description="Set a clear and actionable learning goal." />
 <div className="space-y-6">
 <Input
 label="Learning Goal"
 placeholder="e.g. Pass AWS Solutions Architect, Become React Developer..."
 {...register('goal')}
 error={errors.goal?.message}
 />
 <Textarea
 label="What excites you most about learning this?"
 placeholder="e.g. I enjoy solving problems. I love building software. I've always wanted to understand AI."
 className="min-h-[100px]"
 {...register('excitement')}
 helperText="This helps your learning companion keep you motivated."
 />
 </div>
 </div>
);

const StepThree = ({ register, errors }: any) => (
 <div className="space-y-8">
 <PageHeader title="Imagine yourself one year from now." description="What changes in your life if you achieve this goal?" />
 <div className="space-y-6">
 <Textarea
 label="Your 'Why'"
 placeholder="e.g. I want to switch careers. I want financial freedom. I want to build confidence..."
 className="min-h-[150px] text-lg"
 {...register('why')}
 error={errors.why?.message}
 helperText="This becomes your anchor whenever learning gets difficult."
 />
 </div>
 </div>
);

const StepFour = ({ register, errors }: any) => (
 <div className="space-y-8">
 <PageHeader title="Complete this sentence" description="Identity-based habits create lasting change." />
 <div className="space-y-6">
 <Input
 label="I am becoming..."
 placeholder="e.g. I am becoming a Cloud Engineer."
 className="text-lg"
 {...register('identity')}
 error={errors.identity?.message}
 />
 </div>
 </div>
);

const StepFive = ({ register, errors, control }: any) => (
 <div className="space-y-8">
 <PageHeader title="Learning Availability" description="When and how much can you commit?" />
 <div className="space-y-8">
 <Input
 type="number"
 label="Hours per week"
 placeholder="e.g. 10"
 {...register('hoursPerWeek')}
 error={errors.hoursPerWeek?.message}
 />

 <Controller
 name="preferredTime"
 control={control}
 render={({ field }) => (
 <RadioGroup
 options={[
 { label: 'Morning', value: 'morning' },
 { label: 'Afternoon', value: 'afternoon' },
 { label: 'Evening', value: 'evening' },
 { label: 'Night', value: 'night' },
 ]}
 error={errors.preferredTime?.message}
 {...field}
 />
 )}
 />

 <Controller
 name="sessionDuration"
 control={control}
 render={({ field }) => (
 <RadioGroup
 options={[
 { label: '15 Minutes', value: '15 Minutes' },
 { label: '30 Minutes', value: '30 Minutes' },
 { label: '45 Minutes', value: '45 Minutes' },
 { label: '60 Minutes', value: '60 Minutes' },
 ]}
 error={errors.sessionDuration?.message}
 {...field}
 />
 )}
 />

 <Input
 type="date"
 label="Target completion date"
 {...register('targetDate')}
 error={errors.targetDate?.message}
 />
 </div>
 </div>
);

const StepSix = ({ errors, control }: any) => (
 <div className="space-y-8">
 <PageHeader title="Learning Preferences" description="How do you learn best? Select all that apply." />
 <Controller
 name="learningStyles"
 control={control}
 render={({ field }) => {
 const styles = ['Video', 'Reading', 'Projects', 'Practice', 'Teach Back', 'Reflection'];
 return (
 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
 {styles.map((style) => (
 <label
 key={style}
 className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all hover:bg-background ${
 field.value.includes(style)
 ? 'border-primary-500 bg-primary-50/50 '
 : 'border-border '
 }`}
 >
 <span className="font-medium text-text-primary ">{style}</span>
 <input
 type="checkbox"
 className="hidden"
 checked={field.value.includes(style)}
 onChange={(e) => {
 const newValue = e.target.checked
 ? [...field.value, style]
 : field.value.filter((v: string) => v !== style);
 field.onChange(newValue);
 }}
 />
 <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${
 field.value.includes(style) ? 'border-primary-600 bg-primary-600 ' : 'border-border '
 }`}>
 {field.value.includes(style) && <CheckCircle2 className="h-3 w-3 text-text-primary" strokeWidth={3} />}
 </div>
 </label>
 ))}
 {errors.learningStyles && (
 <p className="col-span-full text-sm text-danger-500">{errors.learningStyles.message}</p>
 )}
 </div>
 );
 }}
 />
 </div>
);

const FinalReview = ({ formData }: { formData: GoalSetupFormValues }) => (
 <div className="space-y-8">
 <div className="text-center">
 <h2 className="mb-2 text-3xl font-bold tracking-tight text-text-primary ">Review Your Journey</h2>
 <p className="text-text-muted ">Everything looks great. Ready to start?</p>
 </div>

 <Card className="overflow-hidden border-2 border-primary-100 ">
 <div className="bg-primary-50 p-6 ">
 <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-600 ">Identity</h3>
 <p className="mt-2 text-xl font-medium italic text-text-primary ">"{formData.identity}"</p>
 </div>
 <CardContent className="divide-y divide-border p-0 ">
 <div className="p-6">
 <h4 className="text-xs font-semibold uppercase text-text-muted">The Goal</h4>
 <p className="mt-1 font-medium text-text-primary ">{formData.goal}</p>
 </div>
 <div className="p-6">
 <h4 className="text-xs font-semibold uppercase text-text-muted">The Why</h4>
 <p className="mt-1 text-text-secondary ">{formData.why}</p>
 </div>

 <div className="grid grid-cols-2 divide-x divide-border ">
 <div className="p-6">
 <h4 className="text-xs font-semibold uppercase text-text-muted">Commitment</h4>
 <p className="mt-1 font-medium text-text-primary ">{formData.hoursPerWeek}h / week ({formData.preferredTime})</p>
 <p className="mt-1 text-sm text-text-muted">{formData.sessionDuration} sessions</p>
 </div>
 <div className="p-6">
 <h4 className="text-xs font-semibold uppercase text-text-muted">Target Date</h4>
 <p className="mt-1 font-medium text-text-primary ">{new Date(formData.targetDate).toLocaleDateString()}</p>
 </div>
 </div>

 <div className="p-6">
 <h4 className="text-xs font-semibold uppercase text-text-muted">Learning Styles</h4>
 <div className="mt-2 flex flex-wrap gap-2">
 {formData.learningStyles.map(style => (
 <span key={style} className="inline-flex items-center rounded-full bg-surface-hover px-2.5 py-0.5 text-xs font-semibold text-text-primary ">
 {style}
 </span>
 ))}
 </div>
 </div>
 </CardContent>
 </Card>
 </div>
);
