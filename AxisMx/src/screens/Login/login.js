import React, { useState } from "react";
import { View, Image, Text, TextInput, Alert, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import AuthController from '../controllers/AuthController';
import { useAuth } from '../context/AuthContext';


const LoginScreen = ({ navigation }) => {
    const 