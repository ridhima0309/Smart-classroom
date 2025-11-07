import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Calendar, Users, BookOpen, CheckCircle, Clock, BarChart3 } from 'lucide-react';
import { useAppContext } from '../App';

export function LandingPage() {
  const { setCurrentPage } = useAppContext();

  const features = [
    {
      icon: Calendar,
      title: 'AI-Powered Scheduling',
      description: 'Advanced algorithms create optimal, clash-free timetables automatically'
    },
    {
      icon: Users,
      title: 'Multi-Role Support',
      description: 'Separate dashboards for Admin, Faculty, HOD, and Students'
    },
    {
      icon: BookOpen,
      title: 'NEP 2020 Compliant',
      description: 'Fully aligned with New Education Policy requirements'
    },
    {
      icon: CheckCircle,
      title: 'Approval Workflow',
      description: 'Structured approval process with HOD/Principal review'
    },
    {
      icon: Clock,
      title: 'Conflict Resolution',
      description: 'Automatic detection and resolution of scheduling conflicts'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights into resource utilization'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Smart Timetable</h1>
            </div>
            <Button onClick={() => setCurrentPage('login')}>
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              AI-powered Smart
              <span className="block text-blue-600">Timetable Scheduler</span>
            </h2>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600">
              Optimized, clash-free, adaptive timetable generation for colleges under NEP 2020.
              Streamline your academic scheduling with intelligent automation.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setCurrentPage('login')}
                className="px-8 py-3"
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-3"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900">
              Powerful Features for Modern Education
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to manage academic schedules efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">
            Ready to Transform Your Timetable Management?
          </h3>
          <Button 
            size="lg" 
            onClick={() => setCurrentPage('login')}
            className="px-8 py-3"
          >
            Start Your Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Calendar className="h-6 w-6" />
            <span className="text-lg font-semibold">Smart Timetable</span>
          </div>
          <p className="text-gray-400">Built for Smart India Hackathon 2024</p>
        </div>
      </footer>
    </div>
  );
}