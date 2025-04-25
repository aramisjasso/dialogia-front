import React, { useState, useEffect } from 'react';
import {
  Flex,
  Link,
  Button,
  Image,
  Box,
  useBreakpointValue,
  Text,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { auth, db } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import {
  LuSearch,
  LuMenu,
  LuLayoutDashboard,
  LuList,
  LuInfo,
  LuFile,
  LuSettings,
} from 'react-icons/lu';
import { FaBell } from 'react-icons/fa';
import { toaster } from "../../components/ui/toaster";
import { FiLogOut } from 'react-icons/fi';

const NavTab = () => {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const avatarBoxSize = useBreakpointValue({ base: '32px', md: '48px' });

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [blink, setBlink] = useState(false);

  const handleNotificationClick = (link) => {
    // Validación de ruta
    if (!link || !link.startsWith('/debate/') || link === '/debate/') {
      // 1) Mostramos el toaster inmediatamente
      toaster.create({
        title: 'Este debate ya no existe o no tiene un vínculo',
        status: 'warning',
        duration: 3000,
      });
    }

    // Ruta válida
    navigate(link);
  };
  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  const getUsername = () => {
    return localStorage.getItem("username") || "usuario-ejemplo";
  };
  // Navigation tabs
  const tabs = [
    { name: 'INICIO', path: '/home', icon: <LuLayoutDashboard size={16} /> },
    { name: 'CATEGORIAS', path: '/categories', icon: <LuList size={16} /> },
    { name: 'ACERCA DE NOSOTROS', path: '/aboutus', icon: <LuInfo size={16} /> },
    { name: 'POLITICAS DE USO', path: '/policies', icon: <LuFile size={16} /> },
  ];

// Subscribe to notifications (sin índice compuesto)
useEffect(() => {


  const username = getUsername();
  console.log("user", username);
  if (!username) return;
  // Sólo filtramos por usuario
  const notifCol = collection(db, 'notifications');
  const q        = query(
    notifCol,
    where('username', '==', username)
  );

  const unsubscribe = onSnapshot(q, snapshot => {
    // 1) Mapeamos todos los docs
    let notifs = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
    console.log('[NavTab] notifs raw:', notifs);
    // 2) Ordenamos nosotros por datareg (desc)
    notifs.sort((a, b) => {
      // datareg viene como Timestamp de Firestore
      const ta = a.datareg.toDate();
      const tb = b.datareg.toDate();
      return tb - ta;
    });

    // 3) Nos quedamos sólo con los 5 más recientes
    notifs = notifs.slice(0, 5);

    // 4) Actualizamos estado y contamos no vistos
    setNotifications(notifs);
    const newUnread = notifs.filter(n => !n.view).length;
    if (newUnread > unreadCount) {
      new Audio('/beep.mp3').play().catch(() => {});
      setBlink(true);
      setTimeout(() => setBlink(false), 300);
    }
    setUnreadCount(newUnread);
  });

  return () => unsubscribe();
}, []);  // sin depender de unreadCount para no re-suscribir

// Manejo de clic en campana (igual que antes)
const handleBellClick = () => {
  setShowDropdown(open => {
    if (!open) {
      notifications.forEach(n => {
        if (!n.view) {
          const notifRef = doc(db, 'notifications', n.id);
          updateDoc(notifRef, { view: true }).catch(console.error);
        }
      });
    }
    return !open;
  });
};


  return (
    <Flex bg="gray.800" p={2} alignItems="center" position="relative">
      {/* Logo */}
      <Image src="LOGO_NAV.png" alt="Dialogia" w="100px" objectFit="contain" />

      {/* Desktop tabs */}
      {!isMobile && (
        <Flex position="absolute" left="50%" transform="translateX(-50%)" gap={4}>
          {tabs.map((tab, i) => (
            <Link
              key={i}
              color="white"
              fontSize="sm"
              onClick={() => navigate(tab.path)}
              _hover={{ opacity: 0.8 }}
              display="flex"
              alignItems="center"
              gap={1}
            >
              {tab.icon}
              <Text>{tab.name}</Text>
            </Link>
          ))}
        </Flex>
      )}

      <Box flex={1} />

      {/* Mobile menu button */}
      {isMobile && (
        <Button variant="ghost" size="sm" onClick={() => setShowMobileMenu(!showMobileMenu)}>
          <LuMenu size={20} />
        </Button>
      )}

      {/* User actions */}
      <Flex gap={2} alignItems="center">
        <Button variant="ghost" size="sm" onClick={() => navigate('/search')}>
          <LuSearch size={18} />
        </Button>

        <Box cursor="pointer" onClick={() => navigate('/profile')}
             boxSize={avatarBoxSize} borderRadius="full" overflow="hidden">
          <Image src={auth.currentUser?.photoURL || 'https://static-00.iconduck.com/assets.00/profile-default-icon-512x511-v4sw4m29.png'} alt="Avatar" objectFit="cover" />
        </Box>

        <Button variant="ghost" size="sm" onClick={handleBellClick}>
          <Box position="relative">
            <FaBell size={18} color={blink ? 'lime' : 'white'} />
            {unreadCount > 0 && (
              <Badge
                pos="absolute"
                top="-1px"
                right="-5px"
                bg="red.500"
                borderRadius="full"
                fontSize="xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Box>
        </Button>

        <Button colorScheme="gray" size="sm" leftIcon={<FiLogOut />} onClick={handleLogout}>
          {!isMobile && 'Cerrar Sesión'}
        </Button>

        <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
          <LuSettings size={18} />
        </Button>
      </Flex>

      {/* Mobile menu dropdown */}
      {isMobile && showMobileMenu && (
        <Box pos="absolute" top="60px" left="0" right="0" bg="gray.700" p={2} zIndex="dropdown">
          <VStack align="stretch" spacing={1}>
            {tabs.map((tab, i) => (
              <Box
                key={i}
                color="white"
                p={2}
                onClick={() => { navigate(tab.path); setShowMobileMenu(false); }}
                _hover={{ bg: 'gray.600' }}
                cursor="pointer"
                display="flex"
                alignItems="center"
                gap={2}
              >
                {tab.icon}
                <Text>{tab.name}</Text>
              </Box>
            ))}
          </VStack>
        </Box>
      )}

      {/* Notifications dropdown */}
      {showDropdown && (
        <Box pos="absolute" top="50px" right="10px" w="300px" bg="white" borderRadius="md" shadow="md" overflow="hidden" zIndex="popover">
          <VStack align="stretch" spacing={0}>
            {notifications.length === 0 ? (
              <Box p={4}>
                <Text fontSize="sm" color="gray.500">No hay notificaciones</Text>
              </Box>
            ) : (
              notifications.map(n => (
                <Box
                key={n.id}
                p={3}
                borderBottom="1px solid #eee"
                cursor="pointer"                    
                _hover={{ bg: 'gray.100' }}         
                onClick={() => handleNotificationClick(n.link)} 
              >
                  <HStack justifyContent="space-between">
                    <Text fontWeight="bold" fontSize="sm">{n.message.split(' ')[0]}</Text>
                    <Text fontSize="xs" color="gray.500">
                      {n.datareg
                        ? n.datareg.toDate().toLocaleString()
                        : 'Cargando fecha...'}
                    </Text>
                  </HStack>
                  <Text fontSize="sm">{n.message.replace(/^\S+/, '').trim()}</Text>
                </Box>
              ))
            )}
          </VStack>
        </Box>
      )}
    </Flex>
  );
};

export default NavTab;
