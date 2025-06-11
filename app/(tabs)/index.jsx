import {
    Spacing,
    ThemedText,
    ThemedView,
    ThemeToggleButton,
    VisitCard
} from '@/components/ui';
import { useVisits } from '@/hooks/useVisits';
import { debugVisitsTable } from '@/lib/database-visits';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VisitsPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { visits, loading, error, refreshVisits } = useVisits();
  const [refreshing, setRefreshing] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('=== VISITS PAGE DEBUG ===');
    console.log('Visits array:', visits);
    console.log('Visits length:', visits.length);
    console.log('Loading:', loading);
    console.log('Error:', error);
    console.log('========================');
  }, [visits, loading, error]);

  // Add this useEffect to run debugging on mount
  useEffect(() => {
    console.log('📱 VisitsPage: Component mounted, running debugVisitsTable...');
    debugVisitsTable();
  }, []);

  const handleVisitPress = (visitId) => {
    console.log(`Visit pressed: ${visitId}`);
    router.push(`/visit-details/${visitId}`);
  };

  const handleRefresh = async () => {
    console.log('🔄 Manual refresh button pressed...');
    setRefreshing(true);
    await refreshVisits();
    setRefreshing(false);
    console.log('✅ Manual refresh completed');
  };

  // Separate visits by status for better organization
  const scheduledVisits = visits.filter(visit => visit.status === 'scheduled');
  const inProgressVisits = visits.filter(visit => visit.status === 'in-progress');
  const completedVisits = visits.filter(visit => visit.status === 'completed');
  const urgentVisits = visits.filter(visit => 
    visit.priority === 'imminent' || visit.priority === 'urgent-comfort'
  );

  console.log('Scheduled visits:', scheduledVisits.length);
  console.log('In progress visits:', inProgressVisits.length);
  console.log('Completed visits:', completedVisits.length);
  console.log('Urgent visits:', urgentVisits.length);

  if (loading && visits.length === 0) {
    console.log('Showing loading state');
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <ThemedText variant="bodyMedium" style={{ marginTop: Spacing.sm }}>
          Loading visits...
        </ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    console.log('Showing error state:', error);
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.md }}>
        <ThemedText variant="titleLarge" style={{ textAlign: 'center', marginBottom: Spacing.sm }}>
          Error Loading Visits
        </ThemedText>
        <ThemedText variant="bodyMedium" style={{ textAlign: 'center' }}>
          {error}
        </ThemedText>
      </ThemedView>
    );
  }

  console.log('Rendering main visits view');

  return (
    <ThemedView style={{ flex: 1 }}>
      {/* Header */}
      <ThemedView 
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: Spacing.md,
          paddingTop: insets.top + Spacing.md,
        }}
      >
        <ThemedText variant="headlineMedium">
          Nursing Visits
        </ThemedText>
        <ThemeToggleButton />
      </ThemedView>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          padding: Spacing.md,
          paddingBottom: insets.bottom + 90 // Tab bar height + extra padding
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Debug Info */}
        <ThemedText variant="bodySmall" style={{ marginBottom: Spacing.md, opacity: 0.7 }}>
          Debug: {visits.length} total visits | Loading: {loading.toString()} | Error: {error || 'none'}
        </ThemedText>

        {/* Urgent/Priority Visits Section */}
        {urgentVisits.length > 0 && (
          <>
            <ThemedText variant="titleMedium" style={{ 
              marginBottom: Spacing.md,
              color: '#EF4444' // Red color for urgent
            }}>
              🚨 Urgent Visits ({urgentVisits.length})
            </ThemedText>

            {urgentVisits.map((visit) => (
              <VisitCard
                key={visit.id}
                visit={visit}
                onPress={() => handleVisitPress(visit.id)}
                style={{ marginBottom: Spacing.md }}
              />
            ))}

            <View style={{ height: Spacing.lg }} />
          </>
        )}

        {/* In Progress Visits */}
        {inProgressVisits.length > 0 && (
          <>
            <ThemedText variant="titleMedium" style={{ 
              marginBottom: Spacing.md,
              color: '#F59E0B' // Orange color for in-progress
            }}>
              ⏳ In Progress ({inProgressVisits.length})
            </ThemedText>

            {inProgressVisits.map((visit) => (
              <VisitCard
                key={visit.id}
                visit={visit}
                onPress={() => handleVisitPress(visit.id)}
                style={{ marginBottom: Spacing.md }}
              />
            ))}

            <View style={{ height: Spacing.lg }} />
          </>
        )}

        {/* Scheduled Visits */}
        <ThemedText variant="titleMedium" style={{ marginBottom: Spacing.md }}>
          📅 Scheduled Visits ({scheduledVisits.length})
        </ThemedText>

        {scheduledVisits.length === 0 ? (
          <ThemedText variant="bodyMedium" style={{ fontStyle: 'italic', opacity: 0.7, marginBottom: Spacing.lg }}>
            No scheduled visits
          </ThemedText>
        ) : (
          scheduledVisits.map((visit) => (
            <VisitCard
              key={visit.id}
              visit={visit}
              onPress={() => handleVisitPress(visit.id)}
              style={{ marginBottom: Spacing.md }}
            />
          ))
        )}

        {/* Completed Visits Section */}
        <ThemedText variant="titleMedium" style={{ 
          marginTop: Spacing.lg, 
          marginBottom: Spacing.md,
          color: '#10B981' // Green color for completed
        }}>
          ✅ Completed Today ({completedVisits.length})
        </ThemedText>

        {completedVisits.length === 0 ? (
          <ThemedText variant="bodyMedium" style={{ fontStyle: 'italic', opacity: 0.7 }}>
            No completed visits today
          </ThemedText>
        ) : (
          completedVisits.map((visit) => (
            <VisitCard
              key={visit.id}
              visit={visit}
              onPress={() => handleVisitPress(visit.id)}
              style={{ marginBottom: Spacing.md }}
            />
          ))
        )}

        {/* Visit Summary Statistics */}
        {visits.length > 0 && (
          <View style={{
            marginTop: Spacing.xl,
            padding: Spacing.md,
            backgroundColor: 'rgba(0,0,0,0.05)',
            borderRadius: Spacing.borderRadius.md,
          }}>
            <ThemedText variant="titleSmall" style={{ marginBottom: Spacing.sm }}>
              📊 Today&apos;s Summary
            </ThemedText>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ alignItems: 'center' }}>
                <ThemedText variant="headlineSmall" style={{ fontWeight: 'bold' }}>
                  {visits.length}
                </ThemedText>
                <ThemedText variant="bodySmall">Total</ThemedText>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <ThemedText variant="headlineSmall" style={{ fontWeight: 'bold', color: '#10B981' }}>
                  {completedVisits.length}
                </ThemedText>
                <ThemedText variant="bodySmall">Completed</ThemedText>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <ThemedText variant="headlineSmall" style={{ fontWeight: 'bold', color: '#F59E0B' }}>
                  {inProgressVisits.length}
                </ThemedText>
                <ThemedText variant="bodySmall">In Progress</ThemedText>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <ThemedText variant="headlineSmall" style={{ fontWeight: 'bold', color: '#6B7280' }}>
                  {scheduledVisits.length}
                </ThemedText>
                <ThemedText variant="bodySmall">Remaining</ThemedText>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
} 