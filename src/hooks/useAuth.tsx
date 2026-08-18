import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';

type AppRole = 'top' | 'normal' | 'admin' | 'manager' | 'site_staff' | 'customer';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  project_id: string | null;
}

export interface User {
  id: string;
  email: string;
}

export interface Session {
  user: User;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: AppRole | null;
  permissions: string[];
  assignedProjects: string[];
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isTopAdmin: boolean;
  isManager: boolean;
  isStaff: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [assignedProjects, setAssignedProjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Self-seeding check for users in Firestore
  useEffect(() => {
    const checkAndSeedUsers = async () => {
      try {
        // Always ensure saroj top admin exists
        const sarojUser = {
          id: "user-saroj",
          user_id: "user-saroj",
          email: "saroj@butwalconstruction.com.np",
          password: "saroj123",
          full_name: "Er. Saroj Aryal (Top Admin)",
          role: "top",
          phone: "+977 9857076965",
          address: "Butwal-11, Kalikanagar",
          project_id: null
        };
        await setDoc(doc(db, 'users', sarojUser.id), sarojUser, { merge: true });

        const seeded = localStorage.getItem('firestore_users_seeded');
        if (seeded) return;

        const usersRef = collection(db, 'users');
        const q = query(usersRef);
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          console.log('No users found in Firestore. Seeding default users...');
          const defaultUsers = [
            {
              id: "user-saroj",
              user_id: "user-saroj",
              email: "saroj@butwalconstruction.com.np",
              password: "saroj123",
              full_name: "Er. Saroj Aryal (Top Admin)",
              role: "top",
              phone: "+977 9857076965",
              address: "Butwal-11, Kalikanagar",
              project_id: null
            },
            {
              id: "user-saroj-alt",
              user_id: "user-saroj-alt",
              email: "saroj@bcb.com",
              password: "saroj123",
              full_name: "Saroj Top Admin",
              role: "top",
              phone: "+977 9851234567",
              address: "Butwal-11, Kalikanagar",
              project_id: null
            },
            {
              id: "user-manager",
              user_id: "user-manager",
              email: "manager@bcb.com",
              password: "manager123",
              full_name: "Anil Editor",
              role: "normal",
              phone: "+977 9841234567",
              address: "Butwal-10, Devinagar",
              project_id: null
            },
            {
              id: "user-staff",
              user_id: "user-staff",
              email: "staff@bcb.com",
              password: "staff123",
              full_name: "Binod Site Staff",
              role: "normal",
              phone: "+977 9801234567",
              address: "Butwal-3, Golpark",
              project_id: "proj-1"
            },
            {
              id: "user-client",
              user_id: "user-client",
              email: "client@bcb.com",
              password: "client123",
              full_name: "Ram Bahadur Client",
              role: "customer",
              phone: "+977 9811234567",
              address: "Butwal-7, Deepnagar",
              project_id: "proj-1"
            }
          ];

          for (const u of defaultUsers) {
            await setDoc(doc(db, 'users', u.id), u);
          }
          localStorage.setItem('firestore_users_seeded', 'true');
          console.log('Seeding completed successfully!');
        }
      } catch (err) {
        console.error('Error seeding users:', err);
      }
    };

    checkAndSeedUsers();
  }, []);

  // Restore session from localStorage
  useEffect(() => {
    const loadSession = async () => {
      try {
        const savedUserId = localStorage.getItem('current_firestore_user_id');
        if (savedUserId) {
          const userDoc = await getDoc(doc(db, 'users', savedUserId));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const u: User = { id: userDoc.id, email: data.email };
            setUser(u);
            setSession({ user: u });
            setProfile({
              id: userDoc.id,
              user_id: userDoc.id,
              full_name: data.full_name || 'User',
              email: data.email,
              phone: data.phone || null,
              address: data.address || null,
              project_id: data.project_id || null
            });
            setRole(data.role as AppRole);
            setPermissions(data.role === 'admin' || data.role === 'manager' ? ['all'] : []);
            setAssignedProjects(data.project_id ? [data.project_id] : []);
          }
        }
      } catch (err) {
        console.error('Error restoring session:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const usersRef = collection(db, 'users');
      // Look up user with both matching email and password
      const q = query(
        usersRef, 
        where('email', '==', email.trim().toLowerCase()), 
        where('password', '==', password)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { error: new Error('Invalid email or password') };
      }

      const userDoc = querySnapshot.docs[0];
      const data = userDoc.data();
      const u: User = { id: userDoc.id, email: data.email };

      localStorage.setItem('current_firestore_user_id', userDoc.id);
      
      setUser(u);
      setSession({ user: u });
      setProfile({
        id: userDoc.id,
        user_id: userDoc.id,
        full_name: data.full_name || 'User',
        email: data.email,
        phone: data.phone || null,
        address: data.address || null,
        project_id: data.project_id || null
      });
      setRole(data.role as AppRole);
      setPermissions(data.role === 'admin' || data.role === 'manager' ? ['all'] : []);
      setAssignedProjects(data.project_id ? [data.project_id] : []);

      return { error: null };
    } catch (err: unknown) {
      console.error('Sign-in error:', err);
      return { error: err instanceof Error ? err : new Error('An error occurred during login') };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('current_firestore_user_id');
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole(null);
    setPermissions([]);
    setAssignedProjects([]);
  };

  const value = {
    user,
    session,
    profile,
    role,
    permissions,
    assignedProjects,
    loading,
    signIn,
    signOut,
    isAdmin: role === 'top' || role === 'admin',
    isTopAdmin: role === 'top',
    isManager: role === 'normal' || role === 'manager',
    isStaff: role === 'normal' || role === 'site_staff',
    isCustomer: role === 'customer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
