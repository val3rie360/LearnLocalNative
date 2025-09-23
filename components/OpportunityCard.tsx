import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type OpportunityCardProps = {
  title: string;
  postedBy: string;
  deadline: string;
  amount: string;
  eligibility: string;
  description: string;
  tag: string;
  onViewDetails?: () => void;
  bookmarked?: boolean;
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={16} color="#4B1EB4" style={styles.icon} />
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail">
      {value}
    </Text>
  </View>
);

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  title,
  postedBy,
  deadline,
  amount,
  eligibility,
  description,
  tag,
  onViewDetails,
  bookmarked = false,
}) => (
  <View style={styles.card}>
    {/* Bookmark */}
    <Ionicons
      name={bookmarked ? "bookmark" : "bookmark-outline"}
      size={22}
      color={bookmarked ? "#4B1EB4" : "#BFC1D1"}
      style={styles.bookmark}
    />

    {/* Title */}
    <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
      {title}
    </Text>

    {/* Info */}
    <InfoRow icon="person-outline" label="Posted by:" value={postedBy} />
    <InfoRow icon="calendar-outline" label="Deadline:" value={deadline} />
    <InfoRow icon="cash-outline" label="Amount:" value={amount} />
    <InfoRow icon="location-outline" label="Eligibility:" value={eligibility} />

    {/* Description */}
    <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">
      {description}
    </Text>

    {/* Footer */}
    <View style={styles.footer}>
      <View style={styles.tag}>
        <Text style={styles.tagText}>{tag}</Text>
      </View>
      <TouchableOpacity style={styles.detailsBtn} onPress={onViewDetails}>
        <Text style={styles.detailsBtnText}>View Details</Text>
        <Ionicons name="arrow-forward" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E6E6FA",
  },
  bookmark: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: "Karla-Bold",
    color: "#4B1EB4",
    marginBottom: 10,
    paddingRight: 30,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    flexWrap: "nowrap",
  },
  icon: {
    marginRight: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: "#4B1EB4",
    fontFamily: "Karla-Bold",
    marginRight: 4,
  },
  infoValue: {
    fontSize: 14,
    color: "#222",
    fontFamily: "Karla",
    flexShrink: 1,
  },
  description: {
    color: "#666",
    fontSize: 13,
    fontFamily: "Karla",
    marginVertical: 8,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  tag: {
    backgroundColor: "#BDFCFF",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 14,
    color: "#0B617C",
    fontFamily: "Karla-Bold",
  },
  detailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4B1EB4",
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  detailsBtnText: {
    color: "#fff",
    fontFamily: "Karla-Bold",
    fontSize: 14,
    marginRight: 6,
  },
});

export default OpportunityCard;
