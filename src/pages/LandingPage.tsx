import React from 'react';
import { 
  Zap, 
  Target, 
  Users, 
  Brain, 
  Trophy, 
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Quote
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { Navbar } from '@/components/layout';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: 'Smart Habit Tracking',
      description: 'Create custom habits with flexible scheduling and intelligent reminders that adapt to your timezone.',
      color: 'text-primary-600 dark:text-primary-400'
    },
    {
      icon: Zap,
      title: 'Gamified Experience',
      description: 'Earn XP, level up, build streaks, and unlock achievements as you build better habits.',
      color: 'text-warning-600 dark:text-warning-400'
    },
    {
      icon: Brain,
      title: 'AI-Powered Coaching',
      description: 'Get personalized motivational messages and insights powered by advanced AI technology.',
      color: 'text-secondary-600 dark:text-secondary-400'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Join circles, share progress, and stay accountable with like-minded habit builders.',
      color: 'text-success-600 dark:text-success-400'
    },
    {
      icon: Trophy,
      title: 'Detailed Analytics',
      description: 'Track your progress with beautiful charts, trends, and insights to optimize your habits.',
      color: 'text-error-600 dark:text-error-400'
    },
    {
      icon: CheckCircle,
      title: 'Forgiveness System',
      description: 'Stay motivated with forgiveness tokens and recovery challenges when life gets in the way.',
      color: 'text-primary-600 dark:text-primary-400'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Manager',
      avatar: '👩‍💼',
      content: 'HabitForge transformed my morning routine. The AI coaching keeps me motivated, and the community support is incredible!',
      rating: 5
    },
    {
      name: 'Marcus Johnson',
      role: 'Fitness Enthusiast',
      avatar: '🏃‍♂️',
      content: 'The gamification aspect makes building habits actually fun. I\'ve maintained a 90-day streak thanks to this app!',
      rating: 5
    },
    {
      name: 'Elena Rodriguez',
      role: 'Student',
      avatar: '👩‍🎓',
      content: 'Perfect for busy schedules. The forgiveness system helped me stay consistent even during exam periods.',
      rating: 5
    }
  ];

  const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '2M+', label: 'Habits Completed' },
    { value: '95%', label: 'Success Rate' },
    { value: '4.9★', label: 'User Rating' }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="overflow-hidden pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12 sm:py-16 md:py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="primary" className="mb-4 sm:mb-6 animate-fade-in text-xs sm:text-sm">
              🚀 New: AI-Powered Habit Coaching
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 animate-slide-up">
              Build Better{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Habits
              </span>
              <br />
              Transform Your Life
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto animate-slide-up px-4">
              Join thousands who are building lasting habits with gamified tracking, 
              AI coaching, and community support. Start your transformation today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-8 sm:mb-12 animate-slide-up px-4">
              <Button 
                variant="primary" 
                size="lg" 
                className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                rightIcon={<ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />}

              >
                Start Building Habits
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
                leftIcon={<Play className="h-4 w-4 sm:h-5 sm:w-5" />}
              >
                Watch Demo
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-2xl mx-auto animate-fade-in px-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              Powerful features designed to make habit building engaging, sustainable, and rewarding.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-4 sm:p-6"
                >
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                      <Icon className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 ${feature.color}`} />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by Habit Builders Worldwide
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See what our community has to say about their transformation journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative" padding="lg">
                <Quote className="absolute top-4 right-4 h-8 w-8 text-primary-200 dark:text-primary-800" />
                
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-warning-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "{testimonial.content}"
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Habits?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already started their journey to better habits. 
            Start free today, no credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="secondary" 
              size="lg" 
              className="text-lg px-8 py-4 bg-white text-primary-600 hover:bg-gray-50"
              rightIcon={<ArrowRight className="h-5 w-5" />}

            >
              Get Started Free
            </Button>
            <Button 
              variant="ghost" 
              size="lg" 
              className="text-lg px-8 py-4 text-white border-white hover:bg-white/10"
            >
              Learn More
            </Button>
          </div>
          
          <p className="text-primary-200 text-sm mt-6">
            Free forever • No credit card required • 5-minute setup
          </p>
        </div>
      </section>

      </div>
    </div>
  );
};

export default LandingPage;