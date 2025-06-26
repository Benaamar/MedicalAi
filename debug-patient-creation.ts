import { storage } from "./server/storage";
import { db } from "./server/db";
import { users, patients } from "./shared/schema";

async function debugPatientCreation() {
  console.log("🔍 Debug de la création de patient...");
  
  try {
    // 1. Test de connexion à la base de données
    console.log("📋 Test 1: Connexion à la base de données");
    const userTables = await db.select().from(users).limit(1);
    console.log("✅ Connexion DB réussie");
    
    // 2. Test des utilisateurs existants
    console.log("📋 Test 2: Vérification des utilisateurs");
    const allUsers = await storage.getAllUsers();
    console.log(`✅ ${allUsers.length} utilisateurs trouvés:`, allUsers.map(u => ({id: u.id, username: u.username, role: u.role})));
    
    // 3. Test de création d'un patient
    console.log("📋 Test 3: Création d'un patient de test");
    const testPatient = {
      firstName: "Test",
      lastName: "Patient",
      birthDate: "1990-01-01",
      phone: "0123456789",
      email: "test@example.com",
      address: "123 rue de Test",
      doctorId: users[0]?.id || 1  // Utiliser le premier utilisateur ou ID 1
    };
    
    console.log("Données du patient test:", testPatient);
    
    const createdPatient = await storage.createPatient(testPatient);
    console.log("✅ Patient créé avec succès:", createdPatient);
    
    // 4. Test de récupération des patients
    console.log("📋 Test 4: Récupération des patients");
    const patients = await storage.getPatientsByDoctor(testPatient.doctorId);
    console.log(`✅ ${patients.length} patients trouvés pour le docteur ${testPatient.doctorId}`);
    
    // 5. Test de suppression du patient test
    console.log("📋 Test 5: Suppression du patient test");
    await storage.deletePatient(createdPatient.id);
    console.log("✅ Patient test supprimé");
    
  } catch (error) {
    console.error("❌ Erreur lors du debug:", error);
    
    if (error instanceof Error) {
      console.error("Message d'erreur:", error.message);
      console.error("Stack trace:", error.stack);
    }
  }
}

// Tests d'API HTTP
async function testPatientAPI() {
  console.log("\n🌐 Test de l'API HTTP...");
  
  try {
    // Simuler une requête de création de patient
    const testData = {
      firstName: "API",
      lastName: "Test", 
      birthDate: "1985-05-15",
      phone: "0987654321",
      email: "api@test.com",
      address: "456 avenue API"
    };
    
    console.log("Données de test API:", testData);
    
    // Test avec fetch local (nécessite que le serveur soit démarré)
    const response = await fetch("http://localhost:5000/api/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // NOTE: Pour tester, il faudrait un vrai token
        "Authorization": "Bearer test-token"
      },
      body: JSON.stringify(testData)
    });
    
    console.log("Status de la réponse:", response.status);
    const result = await response.text();
    console.log("Réponse:", result);
    
  } catch (error) {
    console.error("❌ Erreur API:", error);
  }
}

async function checkEnvironment() {
  console.log("\n🔧 Vérification de l'environnement...");
  
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("DATABASE_URL présent:", !!process.env.DATABASE_URL);
  console.log("JWT_SECRET présent:", !!process.env.JWT_SECRET);
  
  // Vérifier les tables de la base
  try {
    console.log("\n📊 Structure de la base de données:");
    
    // Test de la table users
    const userCount = await db.select().from(storage.users);
    console.log(`✅ Table users: ${userCount.length} entrées`);
    
    // Test de la table patients
    const patientCount = await db.select().from(storage.patients);
    console.log(`✅ Table patients: ${patientCount.length} entrées`);
    
  } catch (error) {
    console.error("❌ Erreur de structure DB:", error);
  }
}

// Fonction principale
async function main() {
  console.log("🚀 Démarrage du debug pour la création de patients\n");
  
  await checkEnvironment();
  await debugPatientCreation();
  // await testPatientAPI(); // Décommentez si le serveur est démarré
  
  console.log("\n✅ Debug terminé");
  process.exit(0);
}

main().catch(console.error); 