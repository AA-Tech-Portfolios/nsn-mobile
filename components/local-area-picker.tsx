import { useMemo } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { lookupLocalAreaSuggestions, normalizeLocationLookupQuery, type LocalAreaSuggestion } from "@/lib/location-lookup";
import { nsnColors } from "@/lib/nsn-data";

type LocalAreaPickerProps = {
  query: string;
  onQueryChange: (query: string) => void;
  onSelect: (area: LocalAreaSuggestion) => void;
  selectedAreaId?: string;
  isDay?: boolean;
  isRtl?: boolean;
  autoFocus?: boolean;
  limit?: number;
  placeholder?: string;
  promptCopy?: string;
  fallbackNote?: string;
};

export function LocalAreaPicker({
  query,
  onQueryChange,
  onSelect,
  selectedAreaId,
  isDay,
  isRtl,
  autoFocus,
  limit = 7,
  placeholder = "Search suburb or region...",
  promptCopy = "Search for a suburb, region, or locality to personalise NSN.",
  fallbackNote = "Prototype location lookup uses local fallback suburb data while API-backed search is being prepared.",
}: LocalAreaPickerProps) {
  const normalizedQuery = normalizeLocationLookupQuery(query);
  const suggestions = useMemo(() => lookupLocalAreaSuggestions(query, limit), [limit, query]);

  return (
    <View style={styles.container}>
      <View style={[styles.inputWrap, isDay && styles.dayInputWrap, isRtl && styles.rtlRow]}>
        <IconSymbol name="magnifyingglass" color={isDay ? "#3B4A63" : nsnColors.muted} size={18} />
        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder={placeholder}
          placeholderTextColor={isDay ? "#6B7890" : nsnColors.muted}
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={autoFocus}
          accessibilityLabel="Search suburbs, regions, and localities"
          style={[styles.input, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}
        />
      </View>
      {!normalizedQuery ? (
        <View style={[styles.promptCard, isDay && styles.dayResultButton]}>
          <Text style={[styles.resultTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{promptCopy}</Text>
          <Text style={[styles.resultMeta, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
            Try CBD, St. Ives, Parra, Northern Beaches, or West Pymble.
          </Text>
          <Text style={[styles.fallbackNote, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{fallbackNote}</Text>
        </View>
      ) : null}
      {suggestions.length > 0 ? (
        <View style={styles.resultGroup}>
          <Text style={[styles.resultGroupTitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Matching suburbs and regions</Text>
          <View style={styles.resultStack}>
            {suggestions.map((area) => {
              const active = area.id === selectedAreaId;

              return (
                <TouchableOpacity
                  key={area.id}
                  activeOpacity={0.82}
                  onPress={() => onSelect(area)}
                  accessibilityRole="button"
                  accessibilityLabel={`Use ${area.label} as local area`}
                  style={[styles.resultButton, active && styles.activeResultButton, isDay && styles.dayResultButton, isDay && active && styles.dayActiveResultButton]}
                >
                  <View style={[styles.resultTopLine, isRtl && styles.rtlRow]}>
                    <Text style={[styles.resultTitle, isDay && styles.dayHeadingText, active && styles.activeResultText, isRtl && styles.rtlText]}>{area.label}</Text>
                    <Text style={[styles.resultBadge, active && styles.activeResultBadge]}>{area.resultType}</Text>
                  </View>
                  <Text style={[styles.resultMeta, isDay && styles.dayMutedText, active && styles.activeResultText, isRtl && styles.rtlText]}>{area.label} - {area.region}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : null}
      {normalizedQuery && suggestions.length === 0 ? (
        <View style={[styles.emptyCard, isDay && styles.dayResultButton]}>
          <Text style={[styles.resultTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>No matching suburb or region yet.</Text>
          <Text style={[styles.resultMeta, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
            Try another Sydney suburb, region, or common shorthand.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  inputWrap: { minHeight: 44, borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", gap: 8 },
  dayInputWrap: { backgroundColor: "#F7FBFF", borderColor: "#B8C9E6" },
  input: { flex: 1, color: nsnColors.text, fontSize: 14, fontWeight: "700", paddingVertical: 8 },
  dayHeadingText: { color: "#0B1220" },
  dayMutedText: { color: "#3B4A63" },
  promptCard: { borderRadius: 14, borderWidth: 1, borderColor: "#24426F", backgroundColor: "rgba(255,255,255,0.035)", paddingHorizontal: 11, paddingVertical: 10 },
  fallbackNote: { color: nsnColors.muted, fontSize: 10, lineHeight: 14, marginTop: 7 },
  resultGroup: { gap: 7 },
  resultGroupTitle: { color: nsnColors.muted, fontSize: 11, fontWeight: "900", lineHeight: 15, textTransform: "uppercase" },
  resultStack: { gap: 8 },
  resultTopLine: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  resultButton: { borderRadius: 12, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, paddingHorizontal: 10, paddingVertical: 8 },
  dayResultButton: { backgroundColor: "#F7FBFF", borderColor: "#B8C9E6" },
  activeResultButton: { borderColor: nsnColors.day, backgroundColor: "#172A5C" },
  dayActiveResultButton: { borderColor: "#3949DB", backgroundColor: "#DCE7FF" },
  resultTitle: { color: nsnColors.text, fontSize: 12, fontWeight: "900", lineHeight: 16 },
  resultMeta: { color: nsnColors.muted, fontSize: 11, lineHeight: 15, marginTop: 2 },
  activeResultText: { color: nsnColors.text },
  resultBadge: { flexShrink: 0, borderRadius: 8, borderWidth: 1, borderColor: "#24426F", color: nsnColors.muted, fontSize: 10, fontWeight: "900", lineHeight: 14, paddingHorizontal: 7, paddingVertical: 2 },
  activeResultBadge: { borderColor: nsnColors.day, color: nsnColors.text },
  emptyCard: { borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, paddingHorizontal: 11, paddingVertical: 10 },
  rtlRow: { flexDirection: "row-reverse" },
  rtlText: { textAlign: "right", writingDirection: "rtl" },
});
