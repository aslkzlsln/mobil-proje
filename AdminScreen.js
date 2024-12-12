import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Button,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { db } from "../config/firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, arrayUnion } from "firebase/firestore";

const AdminScreen = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [newPatientName, setNewPatientName] = useState("");
  const [newTestName, setNewTestName] = useState("");
  const [newTestValue, setNewTestValue] = useState("");
  const [newTestDate, setNewTestDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchPatientName, setSearchPatientName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPatientDoc, setCurrentPatientDoc] = useState(null);

  const addPatientTest = async () => {
    if (!newPatientName || !newTestName || !newTestValue || !newTestDate) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }
    const parsedValue = parseFloat(newTestValue.replace(",", "."));
    if (isNaN(parsedValue)) {
      alert("Geçerli bir değer girin!");
      return;
    }

    const newTest = {
      testName: newTestName,
      value: parsedValue,
      date: newTestDate.toISOString().split("T")[0],
    };

    try {
      const patientCollection = collection(db, "patients");
      const q = query(patientCollection, where("patientName", "==", newPatientName));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        await addDoc(patientCollection, { patientName: newPatientName, tests: [newTest] });
        alert("Hasta ve tahlil başarıyla eklendi!");
      } else {
        const patientDoc = snapshot.docs[0];
        const patientRef = patientDoc.ref;
        await updateDoc(patientRef, { tests: arrayUnion(newTest) });
        alert("Tahlil başarıyla eklendi!");
      }
      setNewPatientName("");
      setNewTestName("");
      setNewTestValue("");
      setNewTestDate(new Date());
    } catch (error) {
      console.error("Hata: ", error);
    }
  };

  const searchPatientTests = async () => {
    if (!searchPatientName) {
      alert("Lütfen bir hasta adı girin!");
      return;
    }
    try {
      const patientCollection = collection(db, "patients");
      const q = query(patientCollection, where("patientName", "==", searchPatientName));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        alert("Hasta bulunamadı!");
        setSearchResults([]);
      } else {
        const patientDoc = snapshot.docs[0];
        setCurrentPatientDoc(patientDoc);
        const patientData = patientDoc.data();
        setSearchResults(patientData.tests || []);
      }
    } catch (error) {
      console.error("Arama sırasında hata oluştu: ", error);
    }
  };

  const deleteTest = async (testToDelete) => {
    if (!currentPatientDoc) return;

    try {
      const updatedTests = searchResults.filter((test) => test !== testToDelete);
      const patientRef = currentPatientDoc.ref;

      await updateDoc(patientRef, { tests: updatedTests });
      setSearchResults(updatedTests);
      alert("Tahlil başarıyla silindi!");
    } catch (error) {
      console.error("Silme sırasında hata oluştu: ", error);
    }
  };

  const renderDashboard = () => (
    <ImageBackground
      source={require("../assets/adminarka.png")} // Arka plan görselini buraya ekleyin
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.dashboardContainer}>
        <Text style={styles.header}>ADMİN DASHBOARD</Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => setActiveSection("createGuide")}
        >
          <Text style={styles.cardText}>Hasta Arama</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => setActiveSection("searchPatients")}
        >
          <Text style={styles.cardText}>Kılavuz Oluştur</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => alert("Diğer İşlevler")}
        >
          <Text style={styles.cardText}>Diğer İşlevler</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );

  const renderCreateGuide = () => (
    <View style={styles.pinkContainer}>
       <ImageBackground
      source={require("../assets/heklearka.png")} // Arka plan görselini buraya ekleyin
      style={styles.backgroundhasta}
    >
      <Text style={styles.header}>Hasta Takibi</Text>
      <TouchableOpacity style={styles.toggleButton} onPress={() => setIsAddingPatient(!isAddingPatient)}>
        <Text style={styles.toggleButtonText}>{isAddingPatient ? "Hasta Görüntüleme Modu" : "Hasta Ekle Modu"}</Text>
      </TouchableOpacity>
      {isAddingPatient ? (
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Hasta Adı Soyadı" value={newPatientName} onChangeText={setNewPatientName} />
          <Picker selectedValue={newTestName} style={styles.picker} onValueChange={(itemValue) => setNewTestName(itemValue)}>
            <Picker.Item label="Tahlil Türü Seçin" value="" />
            <Picker.Item label="IgA" value="IgA" />
            <Picker.Item label="IgA1" value="IgA1" />
            <Picker.Item label="IgA2" value="IgA2" />
            <Picker.Item label="IgM" value="IgM" />
            <Picker.Item label="IgG" value="IgG" />
            <Picker.Item label="IgG1" value="IgG1" />
            <Picker.Item label="IgG2" value="IgG2" />
            <Picker.Item label="IgG3" value="IgG3" />
            <Picker.Item label="IgG4" value="IgG4" />
            
          </Picker>
          <TextInput style={styles.input} placeholder="Değer" value={newTestValue} onChangeText={setNewTestValue} keyboardType="decimal-pad" />
          <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.datePickerText}>{newTestDate.toISOString().split("T")[0]}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={newTestDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setNewTestDate(selectedDate);
              }}
            />
          )}
          <Button title="Ekle" onPress={addPatientTest} />
        </View>
      ) : (
        <View>
          <TextInput style={styles.input} placeholder="Hasta Adı Giriniz" value={searchPatientName} onChangeText={setSearchPatientName} />
          <Button title="Ara" onPress={searchPatientTests} />
          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults.sort((a, b) => new Date(a.date) - new Date(b.date))}
              keyExtractor={(item, index) => `${item.testName}-${index}`}
              renderItem={({ item, index }) => {
                const previousValue = index > 0 ? parseFloat(searchResults[index - 1].value) : null;
                const currentValue = parseFloat(item.value);
                const change =
                  previousValue === null
                    ? "Değişim yok"
                    : currentValue > previousValue
                    ? "Artmış"
                    : currentValue < previousValue
                    ? "Azalmış"
                    : "Değişim yok";
                const changeSymbol =
                  previousValue === null
                    ? "↔"
                    : currentValue > previousValue
                    ? "↑"
                    : currentValue < previousValue
                    ? "↓"
                    : "↔";
                const changeColor = change === "Artmış" ? "red" : change === "Azalmış" ? "green" : "blue";

                return (
                  <View style={styles.listItem}>
                    <Text style={styles.testName}>{item.testName}</Text>
                    <Text style={styles.result}>
                      Tarih: {item.date} - Değer: {currentValue.toFixed(2)}{" "}
                      <Text style={{ color: changeColor }}>{changeSymbol}</Text>
                    </Text>
                    {previousValue !== null && (
                      <Text style={styles.changeDescription}>
                        Önceki Değer: {previousValue.toFixed(2)}, {change}
                      </Text>
                    )}
                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTest(item)}>
                      <Text style={styles.deleteButtonText}>Sil</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          ) : (
            <Text style={styles.noResult}>{searchPatientName ? "Sonuç Bulunamadı" : "Bir hasta adı girin."}</Text>
          )}
        </View>
      )}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setActiveSection("dashboard")}
      >
        <Text style={styles.backButtonText}>Dashboard'a Dön</Text>
      </TouchableOpacity>
      </ImageBackground>
    </View>
  );

  return (
    <View style={styles.container}>
      {activeSection === "dashboard" && renderDashboard()}
      {activeSection === "createGuide" && renderCreateGuide()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  pinkContainer: {
    flex: 1,

  },
  backgroundhasta: {
    flex: 1,
    resizeMode: "cover",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  dashboardContainer: {
    padding: 16,
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 0,
    marginBottom: 30,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#1b263b",
    marginTop: 30,
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 40,
    marginVertical: 10,
    width: "90%",
    alignItems: "center",
    borderColor: "#415a77",
    borderWidth: 1,
  },
  cardText: {
    color: "#e0e1dd",
    fontSize: 18,
    fontWeight: "bold",
  },
  toggleButton: { padding: 15, backgroundColor: "#007BFF", borderRadius: 5, marginBottom: 20, alignItems: "center" },
  toggleButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  form: { padding: 20, backgroundColor: "#fff", borderRadius: 10 },
  input: { height: 50, borderColor: "#ccc", borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginBottom: 10, backgroundColor: "#fff" },
  listItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#ddd", backgroundColor: "#fff", borderRadius: 5, marginVertical: 5 },
  testName: { fontSize: 16, fontWeight: "600" },
  result: { fontSize: 14, color: "#555" },
  deleteButton: { backgroundColor: "red", padding: 10, borderRadius: 5, marginTop: 10 },
  deleteButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  changeDescription: { fontSize: 12, color: "#555", marginTop: 5 },
  noResult: { fontSize: 16, textAlign: "center", color: "#777", marginTop: 20 },
  backButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignSelf: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  datePickerButton: { backgroundColor: "#007BFF", borderRadius: 5, padding: 10, marginBottom: 10, alignItems: "center" },
  datePickerText: { color: "#fff", fontSize: 16 },
});

export default AdminScreen;
