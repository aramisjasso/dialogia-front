import React, { useState, useEffect, useRef } from 'react';
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
  Menu,
  Portal,
  Avatar,
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
} from 'react-icons/lu';
import { FaBell, FaUser } from 'react-icons/fa';
import { toaster } from "../../components/ui/toaster";
import { FiLogOut } from 'react-icons/fi';
import { onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../../contexts/hooks/useAuth';

const NavTab = () => {
  const navigate = useNavigate();
  const menuRef = useRef();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const avatarBoxSize = useBreakpointValue({ base: '32px', md: '48px' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [blink, setBlink] = useState(false);
  const { currentUser } = useAuth();

  // Verificar estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleNotificationClick = (link) => {
    if (!link || !link.startsWith('/debate/') || link === '/debate/') {
      toaster.create({
        title: 'Este debate ya no existe o no tiene un vínculo',
        status: 'warning',
        duration: 3000,
      });
    } else if(link == '/debate/undefined') {
      navigate('/profile');
    } else {
      navigate(link);
    }
  };

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

  // Navigation tabs - modificado para usuarios no logueados
  const tabs = [
    { 
      name: 'INICIO', 
      path: isLoggedIn ? '/home' : '/', 
      icon: <LuLayoutDashboard size={16} />,
      alwaysShow: true 
    },
    { 
      name: 'CATEGORIAS', 
      path: '/categories', 
      icon: <LuList size={16} />,
      alwaysShow: false 
    },
    { 
      name: 'ACERCA DE NOSOTROS', 
      path: '/aboutus', 
      icon: <LuInfo size={16} />,
      alwaysShow: true 
    },
    { 
      name: 'POLITICAS DE USO', 
      path: '/policies', 
      icon: <LuFile size={16} />,
      alwaysShow: true 
    },
  ];

  // Filtrar tabs según autenticación
  const filteredTabs = tabs.filter(tab => tab.alwaysShow || isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) return;

    const username = getUsername();
    if (!username) return;

    const notifCol = collection(db, 'notifications');
    const q = query(notifCol, where('username', '==', username));

    const unsubscribe = onSnapshot(q, snapshot => {
      let notifs = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));

      notifs.sort((a, b) => {
        const ta = a.datareg.toDate();
        const tb = b.datareg.toDate();
        return tb - ta;
      });

      notifs = notifs.slice(0, 5);
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
  }, [isLoggedIn]);

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
      <Image 
        src="LOGO_NAV.png" 
        alt="Dialogia" 
        w="100px" 
        objectFit="contain" 
        cursor="pointer"
        onClick={() => navigate(isLoggedIn ? '/home' : '/')}
      />

      {/* Desktop tabs */}
      {!isMobile && (
        <Flex position="absolute" left="50%" transform="translateX(-50%)" gap={4}>
          {filteredTabs.map((tab, i) => (
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

      {/* User actions - solo muestra si está logueado */}
      {isLoggedIn && (
        <Flex gap={2} alignItems="center">
          <Button 
            variant="ghost" 
            size="sm" 
            color="white" 
            _hover={{bg:"white", color:"black"}} 
            onClick={() => navigate('/search')}
          >
            <LuSearch size={18} />
          </Button>

          <Menu.Root>
            <Menu.Trigger asChild>
              <Box
                cursor="pointer"
                boxSize={avatarBoxSize}
                borderRadius="full"
                overflow="hidden"
                ref={menuRef}
              >
                <Avatar.Root style={{ width: 50, height: 50, borderRadius: '9999px', overflow: 'hidden' }}>
                  <Avatar.Fallback delayMs={600}>{`A${currentUser?.id}`}</Avatar.Fallback>
                  <Avatar.Image src={`/avatar_${currentUser?.avatarId || "1" }.jpg`} alt={`Avatar ${currentUser?.id}`} />
                </Avatar.Root>
              </Box>
            </Menu.Trigger>

            <Portal>
              <Menu.Positioner>
                <Menu.Content minWidth="150px" boxShadow="lg" zIndex="dropdown">
                  <Menu.Item 
                    value="profile"
                    leftIcon={<FaUser />}
                    onClick={() => navigate('/profile')}
                  >
                    Mi Perfil
                  </Menu.Item>
                  <Menu.Item 
                    value="logout"
                    leftIcon={<FiLogOut />}
                    onClick={handleLogout}
                    color="red.500"
                  >
                    Cerrar Sesión
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>

          <Button 
            variant="ghost" 
            size="sm" 
            color="white" 
            _hover={{bg:"white", color:"black"}} 
            onClick={handleBellClick}
          >
            <Box position="relative" color={blink ? 'lime' : undefined}>
              <FaBell size={18} style={{ color: 'inherit' }}  />
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
        </Flex>
      )}

      {/* Mobile menu dropdown */}
      {isMobile && showMobileMenu && (
        <Box pos="absolute" top="60px" left="0" right="0" bg="gray.700" p={2} zIndex="dropdown">
          <VStack align="stretch" spacing={1}>
            {filteredTabs.map((tab, i) => (
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
      {showDropdown && isLoggedIn && (
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