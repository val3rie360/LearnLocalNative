import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

const Profile: React.FC = () => {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: '#F6F4FE',
                alignItems: 'center',
                paddingTop: 60,
            }}
        >
            {/* Profile Section */}
            <View style={{ alignItems: 'center', marginBottom: 30 }}>
                <View
                    style={{
                        backgroundColor: '#EAE8FD',
                        borderRadius: 85,
                        padding: 6,
                        marginBottom: 10,
                    }}
                >
                    <FontAwesome name="user-circle-o" size={85} color="#000" />
                </View>
                <Text
                    style={{
                        fontSize: 20,
                        color: '#000',
                        fontFamily: 'Karla-Bold',
                        marginBottom: 4,
                    }}
                >
                    Rach Ramirez
                </Text>
                <Text
                    style={{
                        fontSize: 14,
                        color: '#7D7CFF',
                        fontFamily: 'Karla-Bold',
                        marginBottom: 10,
                    }}
                >
                    @rachramz
                </Text>
                <View
                    style={{
                        backgroundColor: '#FFB3B3',
                        paddingVertical: 4,
                        paddingHorizontal: 12,
                        borderRadius: 8,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            color: '#000',
                            fontFamily: 'Karla-Bold',
                        }}
                    >
                        Student
                    </Text>
                </View>
            </View>

            {/* Divider */}
            <View
                style={{
                    height: 1,
                    backgroundColor: '#D3D1FA',
                    width: '85%',
                    marginBottom: 20,
                }}
            />

            {/* Menu Section */}
            <View style={{ width: '85%' }}>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 5,
                    }}
                >
                    <Ionicons
                        name="settings-sharp"
                        size={22}
                        color="#7D7CFF"
                        style={{
                            backgroundColor: '#EAE8FD',
                            borderRadius: 10,
                            padding: 6,
                            marginRight: 12,
                        }}
                    />
                    <Text
                        style={{
                            fontSize: 16,
                            fontFamily: 'Karla-Bold',
                            color: '#000',
                        }}
                    >
                        Settings
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 12,
                    }}
                >
                    <FontAwesome
                        name="users"
                        size={22}
                        color="#7D7CFF"
                        style={{
                            backgroundColor: '#EAE8FD',
                            borderRadius: 10,
                            padding: 6,
                            marginRight: 12,
                        }}
                    />
                    <Text
                        style={{
                            fontSize: 16,
                            fontFamily: 'Karla-Bold',
                            color: '#000',
                        }}
                    >
                        Community Forum
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 5,
                    }}
                >
                    <MaterialIcons
                        name="exit-to-app"
                        size={22}
                        color="#FF6B6B"
                        style={{
                            backgroundColor: '#FFE5E5',
                            borderRadius: 10,
                            padding: 6,
                            marginRight: 12,
                        }}
                    />
                    <Text
                        style={{
                            fontSize: 16,
                            fontFamily: 'Karla-Bold',
                            color: '#FF6B6B',
                        }}
                    >
                        Log Out
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Profile;
