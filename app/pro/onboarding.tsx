import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Check } from 'lucide-react-native';
import { useForm, FormProvider } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProKycDraft } from '@/types/pro';
import { ProKycInput } from '@/lib/proKycSchema';

import { Step1Identity } from '@/components/pro/steps/Step1Identity';
import { Step2Contact } from '@/components/pro/steps/Step2Contact';
import { Step3Documents } from '@/components/pro/steps/Step3Documents';
import { Step4Profile } from '@/components/pro/steps/Step4Profile';
import { Step5Review } from '@/components/pro/steps/Step5Review';

const DRAFT_KEY = '@zima.pro.kyc.draft';

const STEPS = [
  { id: 1, title: 'Identité', component: Step1Identity },
  { id: 2, title: 'Contact', component: Step2Contact },
  { id: 3, title: 'Documents', component: Step3Documents },
  { id: 4, title: 'Profil Pro', component: Step4Profile },
  { id: 5, title: 'Révision', component: Step5Review },
];

export default function ProOnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<Partial<ProKycInput>>({
    mode: 'onChange',
    defaultValues: {},
  });

  useEffect(() => {
    loadDraft();
  }, []);

  useEffect(() => {
    const subscription = methods.watch(async (values) => {
      try {
        const draft: ProKycDraft = { ...values, currentStep };
        await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      } catch (error) {
        console.error('Error saving draft:', error);
      }
    });
    return () => subscription.unsubscribe();
  }, [methods, currentStep]);

  const loadDraft = async () => {
    try {
      const raw = await AsyncStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft: ProKycDraft = JSON.parse(raw);
        if (draft.currentStep) {
          setCurrentStep(draft.currentStep);
        }
        methods.reset(draft);
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const values = methods.getValues();
      console.log('Submitting KYC:', values);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await AsyncStorage.removeItem(DRAFT_KEY);
      
      router.replace('/pro/status?status=pending_review');
    } catch (error) {
      console.error('Error submitting KYC:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.header}>
        <Pressable onPress={handleBack} style={s.backBtn}>
          <ChevronLeft size={24} color="#111827" />
        </Pressable>
        <Text style={s.headerTitle}>Devenir prestataire</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={s.stepper}>
        {STEPS.map((step, idx) => (
          <View key={step.id} style={s.stepItem}>
            <View
              style={[
                s.stepCircle,
                currentStep > step.id && s.stepCircleCompleted,
                currentStep === step.id && s.stepCircleActive,
              ]}
            >
              {currentStep > step.id ? (
                <Check size={14} color="#fff" />
              ) : (
                <Text
                  style={[
                    s.stepNumber,
                    currentStep === step.id && s.stepNumberActive,
                  ]}
                >
                  {step.id}
                </Text>
              )}
            </View>
            {idx < STEPS.length - 1 && (
              <View
                style={[
                  s.stepLine,
                  currentStep > step.id && s.stepLineCompleted,
                ]}
              />
            )}
          </View>
        ))}
      </View>

      <Text style={s.stepTitle}>{STEPS[currentStep - 1].title}</Text>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={s.content}
          contentContainerStyle={s.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <FormProvider {...methods}>
            <CurrentStepComponent />
          </FormProvider>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={s.footer}>
        {currentStep < STEPS.length ? (
          <Pressable style={s.nextBtn} onPress={handleNext}>
            <Text style={s.nextBtnText}>Continuer</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[s.nextBtn, isSubmitting && s.nextBtnDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={s.nextBtnText}>
              {isSubmitting ? 'Envoi en cours...' : 'Soumettre pour vérification'}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  stepItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: { borderColor: '#059669', backgroundColor: '#ecfdf5' },
  stepCircleCompleted: { borderColor: '#059669', backgroundColor: '#059669' },
  stepNumber: { fontSize: 12, fontWeight: '600', color: '#9ca3af' },
  stepNumberActive: { color: '#059669' },
  stepLine: { flex: 1, height: 2, backgroundColor: '#e5e7eb', marginHorizontal: 4 },
  stepLineCompleted: { backgroundColor: '#059669' },
  stepTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  content: { flex: 1 },
  contentContainer: { paddingHorizontal: 24, paddingBottom: 24 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  nextBtn: {
    height: 52,
    backgroundColor: '#059669',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnDisabled: { opacity: 0.5 },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
