import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, SegmentedButtons, Snackbar, useTheme } from 'react-native-paper';
import { QuickForm } from './QuickForm';
import { DetailedForm } from './DetailedForm';
import { SSResultsPanel } from './SSResultsPanel';
import { NetByClaimAgeChart } from './NetByClaimAgeChart';
import {
  InputMode,
  QuickModeInputs,
  DetailedModeInputs,
  SSHealthcareResults,
  ClaimAgeSweepPoint,
  computeSSHealthcareResults,
  getDefaultQuickInputs,
  getDefaultDetailedInputs,
  quickToDetailed,
  ClaimAge,
} from '@projection/shared';
import { UpgradeBanner } from '../../../components';
import { useTier } from '../../../contexts/TierContext';

export default function SSHealthcareTab() {
  const theme = useTheme();
  const { features, canAccessFeature } = useTier();
  const hasDetailedMode = canAccessFeature('ssDetailedMode');
  
  const [mode, setMode] = useState<InputMode>('QUICK');
  const [quickInputs, setQuickInputs] = useState<QuickModeInputs>(getDefaultQuickInputs());
  const [detailedInputs, setDetailedInputs] = useState<DetailedModeInputs>(getDefaultDetailedInputs());
  const [results, setResults] = useState<SSHealthcareResults | null>(null);
  const [claimAgeSweep, setClaimAgeSweep] = useState<ClaimAgeSweepPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  const handleModeSwitch = (newMode: string) => {
    const modeValue = newMode as InputMode;
    if (modeValue === mode) return;

    // Block detailed mode for free users
    if (modeValue === 'DETAILED' && !hasDetailedMode) {
      setSnackbar({ visible: true, message: 'Detailed mode requires Pro or Premium' });
      return;
    }

    // Migrate data when switching from Quick to Detailed
    if (mode === 'QUICK' && modeValue === 'DETAILED') {
      const migrated = quickToDetailed(quickInputs);
      setDetailedInputs(migrated);
    }
    // When switching from Detailed to Quick, preserve basic values
    else if (mode === 'DETAILED' && modeValue === 'QUICK') {
      setQuickInputs({
        birthYear: detailedInputs.birthYear,
        claimAge: detailedInputs.claimAge,
        incomeToday: detailedInputs.magi,
        yearsWorked: 25, // Default assumption
        stateCode: detailedInputs.stateCode,
      });
    }

    setMode(modeValue);
    setResults(null); // Clear results on mode switch
  };

  const handleCompute = () => {
    setLoading(true);

    try {
      const currentInputs = mode === 'QUICK' ? quickInputs : detailedInputs;

      // Compute results (handles both Quick and Detailed)
      const computed = computeSSHealthcareResults(currentInputs);
      setResults(computed);

      // Store claim age sweep for chart (available in both modes)
      setClaimAgeSweep(computed.sweep || []);

      setSnackbar({ visible: true, message: 'Computation complete!' });
    } catch (err: any) {
      setSnackbar({ visible: true, message: err.message || 'Computation error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Mode Switcher */}
      <View style={styles.modeSwitcher}>
        <SegmentedButtons
          value={mode}
          onValueChange={handleModeSwitch}
          buttons={[
            {
              value: 'QUICK',
              label: 'Quick (5 Questions)',
            },
            {
              value: 'DETAILED',
              label: 'Detailed',
            },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Upgrade banner for detailed mode */}
        {!hasDetailedMode && (
          <UpgradeBanner
            feature="Detailed SS & Medicare Analysis"
            requiredTier="PRO"
            icon="file-document-multiple"
            compact
          />
        )}

        {/* Input Form */}
        {mode === 'QUICK' ? (
          <QuickForm
            inputs={quickInputs}
            onChange={setQuickInputs}
            disabled={loading}
          />
        ) : (
          <DetailedForm
            inputs={detailedInputs}
            onChange={setDetailedInputs}
            disabled={loading}
          />
        )}

        {/* Compute Button */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleCompute}
            loading={loading}
            disabled={loading}
            icon="calculator"
            buttonColor={theme.colors.primary}
            style={styles.computeButton}
          >
            Compute
          </Button>
        </View>

        {/* Results */}
        <SSResultsPanel
          results={results}
          loading={loading}
          mode={mode}
        />

        {/* Claim Age Chart (show in Detailed mode or if sweep data exists) */}
        {mode === 'DETAILED' && claimAgeSweep.length > 0 && (
          <NetByClaimAgeChart
            sweep={claimAgeSweep}
            selectedAge={detailedInputs.claimAge}
            loading={loading}
          />
        )}
      </ScrollView>

      {/* Snackbar for notifications */}
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbar({ visible: false, message: '' }),
        }}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  modeSwitcher: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(74, 189, 172, 0.2)',
  },
  segmentedButtons: {
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  placeholder: {
    padding: 16,
  },
  buttonContainer: {
    padding: 16,
  },
  computeButton: {
    paddingVertical: 6,
  },
});
