import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { Button, Input, Card, Checkbox } from '@/components/ui';
import { userRegistrationSchema, type UserRegistrationData } from '@/utils/validationUtils';

interface RegisterFormProps {
  onSubmit: (data: UserRegistrationData) => Promise<void>;
  onSwitchToLogin: () => void;
  isLoading?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  onSwitchToLogin,
  isLoading = false,
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserRegistrationData>({
    resolver: zodResolver(userRegistrationSchema),
  });

  const password = watch('password');
  
  // Password strength indicators
  const passwordStrength = {
    hasLength: password?.length >= 8,
    hasLower: /[a-z]/.test(password || ''),
    hasUpper: /[A-Z]/.test(password || ''),
    hasNumber: /\d/.test(password || ''),
  };

  const passwordStrengthScore = Object.values(passwordStrength).filter(Boolean).length;

  const handleFormSubmit = async (data: UserRegistrationData) => {
    if (!acceptTerms) {
      setSubmitError('Please accept the Terms of Service and Privacy Policy to continue.');
      return;
    }

    try {
      setSubmitError(null);
      await onSubmit(data);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto" padding="lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Create Account
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Start your habit transformation journey today
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {submitError && (
          <div className="p-3 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-error-600 dark:text-error-400 flex-shrink-0" />
            <p className="text-sm text-error-700 dark:text-error-300">{submitError}</p>
          </div>
        )}

        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          leftIcon={<User className="h-4 w-4" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="space-y-2">
          <Input
            label="Password"
            type="password"
            placeholder="Create a strong password"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            {...register('password')}
          />
          
          {password && (
            <div className="space-y-2">
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i < passwordStrengthScore
                        ? passwordStrengthScore <= 2
                          ? 'bg-error-500'
                          : passwordStrengthScore === 3
                          ? 'bg-warning-500'
                          : 'bg-success-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                ))}
              </div>
              
              <div className="text-xs space-y-1">
                {Object.entries({
                  'At least 8 characters': passwordStrength.hasLength,
                  'One lowercase letter': passwordStrength.hasLower,
                  'One uppercase letter': passwordStrength.hasUpper,
                  'One number': passwordStrength.hasNumber,
                }).map(([requirement, met]) => (
                  <div key={requirement} className="flex items-center gap-2">
                    <CheckCircle
                      className={`h-3 w-3 ${
                        met ? 'text-success-500' : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                    <span
                      className={`${
                        met ? 'text-success-600 dark:text-success-400' : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {requirement}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Checkbox
          label="I accept the Terms of Service and Privacy Policy"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          description="By creating an account, you agree to our terms and privacy policy."
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={isSubmitting || isLoading}
          disabled={!acceptTerms}
        >
          Create Account
        </Button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            Sign in
          </button>
        </p>
      </form>
    </Card>
  );
};
