import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { ArrowLeft, FileText, Shield, Info } from 'lucide-react-native';
import Colors from '@/constants/colors';

type LegalSection = 'terms' | 'privacy' | 'legal';

export default function LegalScreen() {
  const [activeSection, setActiveSection] = useState<LegalSection>('terms');

  const sections = [
    { id: 'terms' as LegalSection, title: 'Conditions d\'utilisation', icon: FileText },
    { id: 'privacy' as LegalSection, title: 'Politique de confidentialité', icon: Shield },
    { id: 'legal' as LegalSection, title: 'Informations légales', icon: Info },
  ];

  const renderTermsContent = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Conditions d&apos;utilisation ZIMA</Text>
      
      <Text style={styles.sectionSubtitle}>1. Introduction</Text>
      <Text style={styles.paragraph}>
        Bienvenue sur ZIMA, la plateforme qui connecte acheteurs, locataires et professionnels de l&apos;immobilier en Afrique. 
        En utilisant nos services, vous acceptez les présentes conditions d&apos;utilisation.
      </Text>

      <Text style={styles.sectionSubtitle}>2. Définitions</Text>
      <Text style={styles.paragraph}>
        • &quot;Plateforme&quot; : l&apos;application mobile et le site web ZIMA{`
`}
        • &quot;Utilisateur&quot; : toute personne utilisant la plateforme{`
`}
        • &quot;Prestataire&quot; : professionnel de l&apos;immobilier inscrit sur la plateforme{`
`}
        • &quot;Annonce&quot; : propriété ou service publié sur la plateforme
      </Text>

      <Text style={styles.sectionSubtitle}>3. Services</Text>
      <Text style={styles.paragraph}>
        ZIMA propose une plateforme de mise en relation entre utilisateurs et professionnels de l&apos;immobilier, 
        incluant la publication d&apos;annonces, la messagerie, et les outils de gestion pour les prestataires.
      </Text>

      <Text style={styles.sectionSubtitle}>4. Comptes utilisateur</Text>
      <Text style={styles.paragraph}>
        Vous devez créer un compte pour utiliser certaines fonctionnalités. Vous êtes responsable de la confidentialité 
        de vos identifiants et de toutes les activités effectuées sous votre compte.
      </Text>

      <Text style={styles.sectionSubtitle}>5. Responsabilités des prestataires</Text>
      <Text style={styles.paragraph}>
        Les prestataires s&apos;engagent à fournir des informations exactes, à respecter les rendez-vous pris, 
        et à maintenir un niveau de service professionnel.
      </Text>
    </View>
  );

  const renderPrivacyContent = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Politique de confidentialité</Text>
      
      <Text style={styles.sectionSubtitle}>1. Données collectées</Text>
      <Text style={styles.paragraph}>
        Nous collectons les informations que vous nous fournissez directement (nom, email, téléphone), 
        les données d&apos;utilisation de la plateforme, et les informations de localisation si vous l&apos;autorisez.
      </Text>

      <Text style={styles.sectionSubtitle}>2. Utilisation des données</Text>
      <Text style={styles.paragraph}>
        Vos données sont utilisées pour fournir nos services, améliorer l&apos;expérience utilisateur, 
        faciliter les mises en relation, et vous envoyer des communications pertinentes.
      </Text>

      <Text style={styles.sectionSubtitle}>3. Partage des données</Text>
      <Text style={styles.paragraph}>
        Nous ne vendons pas vos données personnelles. Nous les partageons uniquement avec les prestataires 
        dans le cadre des services demandés, et avec nos partenaires techniques sous contrat de confidentialité.
      </Text>

      <Text style={styles.sectionSubtitle}>4. Sécurité</Text>
      <Text style={styles.paragraph}>
        Nous mettons en place des mesures techniques et organisationnelles appropriées pour protéger vos données 
        contre tout accès non autorisé, altération, divulgation ou destruction.
      </Text>

      <Text style={styles.sectionSubtitle}>5. Vos droits</Text>
      <Text style={styles.paragraph}>
        Vous avez le droit d&apos;accéder à vos données, de les rectifier, de les supprimer, 
        et de vous opposer à leur traitement. Contactez-nous à privacy@zima.com pour exercer ces droits.
      </Text>
    </View>
  );

  const renderLegalContent = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Informations légales</Text>
      
      <Text style={styles.sectionSubtitle}>Éditeur</Text>
      <Text style={styles.paragraph}>
        ZIMA SAS{'\n'}
        Capital social : 100 000 €{'\n'}
        RCS Paris 123 456 789{'\n'}
        Siège social : 123 Avenue des Champs-Élysées, 75008 Paris, France
      </Text>

      <Text style={styles.sectionSubtitle}>Directeur de publication</Text>
      <Text style={styles.paragraph}>
        [Nom du directeur de publication]
      </Text>

      <Text style={styles.sectionSubtitle}>Hébergement</Text>
      <Text style={styles.paragraph}>
        Amazon Web Services{'\n'}
        410 Terry Avenue North{'\n'}
        Seattle, WA 98109, États-Unis
      </Text>

      <Text style={styles.sectionSubtitle}>Propriété intellectuelle</Text>
      <Text style={styles.paragraph}>
        Tous les éléments de la plateforme ZIMA (textes, images, logos, marques) sont protégés par le droit d&apos;auteur 
        et les droits de propriété intellectuelle. Toute reproduction non autorisée est interdite.
      </Text>

      <Text style={styles.sectionSubtitle}>Signalement d&apos;abus</Text>
      <Text style={styles.paragraph}>
        Pour signaler un contenu inapproprié ou un abus, contactez-nous à abuse@zima.com
      </Text>
    </View>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'terms':
        return renderTermsContent();
      case 'privacy':
        return renderPrivacyContent();
      case 'legal':
        return renderLegalContent();
      default:
        return renderTermsContent();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: 'Légal & Confidentialité',
          headerTransparent: false,
          headerStyle: { backgroundColor: Colors.background.primary },
          headerTitleStyle: { color: Colors.text.primary },
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.tabContainer}>
        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={[styles.tab, activeSection === section.id && styles.activeTab]}
            onPress={() => setActiveSection(section.id)}
          >
            <section.icon 
              size={16} 
              color={activeSection === section.id ? Colors.primary : Colors.text.secondary} 
            />
            <Text style={[
              styles.tabText, 
              activeSection === section.id && styles.activeTabText
            ]}>
              {section.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 6,
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentSection: {
    backgroundColor: Colors.background.primary,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  bottomSpacer: {
    height: 40,
  },
});