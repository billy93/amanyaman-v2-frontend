/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React from 'react';
// import storage from 'redux-persist/lib/storage';
import {
  Box,
  Flex,
  Avatar,
  Popover,
  PopoverContent,
  PopoverBody,
  PopoverTrigger,
  HStack,
  Link as NewLink,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Icon,
  Image,
  Stack,
  Spacer,
  CloseButton,
  Text,
  Drawer,
  DrawerContent,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronRightIcon } from '@chakra-ui/icons';
import Logo from '../img/logo.svg';
import {
  Link,
  NavLink as Nav,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { MdLogout, MdArrowDropDown } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCurrentTraveller,
  Menulist,
  userLoginCurrent,
  logOut,
  setCredentials,
} from '../features/auth/authSlice';
import { FiHome, FiEdit, FiBell, FiFileText } from 'react-icons/fi';
import { motion } from 'framer-motion';
// import { BsFillPencilFill } from 'react-icons/bs';
const LinkItems = [
  { name: 'Policy', icon: FiHome },
  { name: 'Claim', icon: FiEdit },
  { name: 'Notification', icon: FiBell },
];
const LinkItemsUser = [
  { name: 'Policy', icon: FiHome },
  { name: 'Products', icon: FiEdit },
  { name: 'Dashboard', icon: FiBell },
  { name: 'News & Promo', icon: FiFileText },
];

export default function Navbar({ allowedRoles }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const username = useSelector(userLoginCurrent);
  const menus = useSelector(Menulist);
  const traveller = useSelector(selectCurrentTraveller);
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  const handleLogout = () => {
    dispatch(logOut());
    // setPersist(null)
    // storage.removeItem('persist:root');
    // storage.removeItem('persist');

    const persistedStateJSON = localStorage.getItem('persist:root');

    if (persistedStateJSON) {
      const persistedState = JSON.parse(persistedStateJSON);
      const del = persistedState.quotaSearch;
      console.log('testPersistedState', del);
      // Step 3: Save the updated persisted state back to localStorage
      const updatedPersistedStateJSON = JSON.stringify(persistedState);
      localStorage.setItem('persist:root', updatedPersistedStateJSON);

      console.log('Persisted state after logout:', updatedPersistedStateJSON);
    } else {
      console.log('No persisted state found in localStorage');
    }
  };
  // console.log('location', location);
  const masterDataRoutes = [
    '/master-data',
    '/master-data/master-product',
    '/master-data/master-price',
  ];

  const [active, setActive] = React.useState(false);
  const isMasterDataActive = (location) => {
    return location?.pathname !== '/master-data/master-user' ? true : false;
  };

  // console.log('isMasterDataActive', location.pathname);
  React.useEffect(() => {
    if (location.pathname !== '/master-data/master-user') {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [active, location.pathname]);

  const handleCreatePolicy = () => {
    const addStep = {
      ...username,
      historyStep: 0,
    };
    dispatch(setCredentials({ ...addStep }));
    navigate('/create-quota/search');
  };
  const userMenu = menus.find((menuItem) => menuItem.role === allowedRoles[0]);
  const menuItems = userMenu ? userMenu.menu : [];

  // console.log('userMenu', userMenu);
  // console.log('userMenu', menuItems);
  const NavItem = ({ icon, children, ...rest }) => {
    return (
      <Link
        href="#"
        style={{ textDecoration: 'none' }}
        _focus={{ boxShadow: 'none' }}
      >
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          borderBottom={'1px solid'}
          borderColor={'#ebebeb'}
          _hover={{
            bg: '#065BAA',
            color: 'white',
          }}
          {...rest}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="12px"
              _groupHover={{
                color: 'white',
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Link>
    );
  };

  const SidebarContent = ({ onClose, ...rest }) => {
    return (
      <Box
        transition="3s ease"
        bg={useColorModeValue('white', 'gray.900')}
        borderRight="1px"
        borderRightColor={useColorModeValue('gray.200', 'gray.700')}
        w={{ base: 'full', md: 60 }}
        pos="fixed"
        h="full"
        {...rest}
      >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
            Logo
          </Text>
          <CloseButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onClose}
          />
        </Flex>
        {traveller !== undefined
          ? LinkItems.map((link) => (
              <NavItem key={link.name} icon={link.icon}>
                {link.name}
              </NavItem>
            ))
          : LinkItemsUser.map((link) => (
              <NavItem key={link.name} icon={link.icon}>
                {link.name}
              </NavItem>
            ))}
      </Box>
    );
  };
  const DesktopSubNav = ({ label, link, name }) => {
    return (
      <motion.div
        whileHover={{
          scale: 1.1,
          originX: 0,
          color: '#065BAA',
        }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <NewLink
          href={link} // Update the href prop
          role={'group'}
          display={'block'}
          p={2}
          rounded={'md'}
          _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}
        >
          <Stack direction={'row'} align={'center'}>
            <Box>
              <Text
                transition={'all .3s ease'}
                _groupHover={{ color: 'pink.400' }}
                fontWeight={500}
              >
                {label}
              </Text>
              <Text fontSize={'sm'}>{name}</Text>
            </Box>
            <Flex
              transition={'all .3s ease'}
              transform={'translateX(-10px)'}
              opacity={0}
              _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
              justify={'flex-end'}
              align={'center'}
              flex={1}
            >
              <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
            </Flex>
          </Stack>
        </NewLink>
      </motion.div>
    );
  };
  return (
    <>
      <Box
        w={{ base: '100%' }}
        position={'fixed'}
        bg={useColorModeValue('white.100', 'white.900')}
        px={4}
        borderBottom="1px"
        borderColor="#ebebeb"
        zIndex={'999'}
      >
        <Flex
          h={16}
          alignItems={'center'}
          justifyContent={'space-between'}
          bg="white"
        >
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
            bg="white"
            color="#231F20"
            border="none"
            variant={'base'}
          />
          <Box
            width={{ base: '100%', md: '180px' }}
            display={'flex'}
            justifyContent={'space-around'}
            alignItems={'center'}
          >
            <Box display={'flex'} alignItems={'center'}>
              <Image src={Logo} alt="logo" width="133px" />
              <Box
                p={'3px'}
                size="xs"
                w={'35px'}
                h="20px"
                bg="#065BAA"
                color="white"
                display="flex"
                justifyContent="center"
                alignItems="center"
                borderRadius={'base'}
              >
                <Text
                  as="b"
                  size={'xs'}
                  style={{ fontSize: '9px', padding: '3px' }}
                >
                  {username?.firstName !== undefined ? 'Sale' : 'Claim'}
                </Text>
              </Box>
            </Box>
          </Box>
          <Spacer />
          <HStack spacing={8} alignItems={'center'}>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {
                // roles?.some(role => allowedRoles.includes(role.name)) &&(
                // sortMenuRole()
                menuItems.map((link, i) => (
                  // <NavLink key={i} {...link}>{link.name}</NavLink>
                  <>
                    <Popover trigger={'hover'} placement={'bottom-start'}>
                      <PopoverTrigger>
                        {link?.children ? (
                          <motion.span
                            style={{
                              fontSize: '14px',
                              fontFamily: 'Mulish',
                              fontWeight: 'bold',
                              color: '#231F20',
                            }}
                            className={active ? 'active' : 'nav-active '}
                          >
                            {link.name}
                          </motion.span>
                        ) : (
                          <NewLink
                            as={Nav}
                            to={link?.link}
                            variant={'outline'}
                            _hover={{ color: '#065BAA' }}
                            className="nav-active "
                            activeClassName="active nav-active "
                          >
                            {link.name}
                          </NewLink>
                        )}
                        {/* <NewLink
                          key={i}
                          as={Nav}
                          to={link?.children ? '#' : link?.link}
                          p={2}
                          fontSize={'sm'}
                          style={{
                            fontSize: '14px',
                          }}
                          fontWeight={800}
                          fontFamilly={'Mulish'}
                          color={linkColor}
                          activeClassName="active"
                          _activeLink={{
                            fontWeight: 'bold',
                            color: '#065BAA',
                            borderBottom: '1px solid #065BAA',
                          }}
                          _hover={{
                            textDecoration: 'none',
                            color: linkHoverColor,
                            pointerEvents: 'none',
                          }}
                        >
                          {link.name}
                        </NewLink> */}
                      </PopoverTrigger>

                      {link.children && (
                        <PopoverContent
                          border={0}
                          boxShadow={'xl'}
                          bg={popoverContentBgColor}
                          p={4}
                          rounded={'xl'}
                          minW={'sm'}
                        >
                          <PopoverBody maxHeight="200px" overflowY="auto">
                            {link.children.map((child, i) => (
                              <DesktopSubNav key={i} {...child} />
                            ))}
                          </PopoverBody>
                        </PopoverContent>
                      )}
                    </Popover>
                  </>
                ))
                // )
              }
            </HStack>
          </HStack>
          <Spacer />
          {userMenu?.role === 'ROLE_TRAVEL_AGENT' && (
            <Button variant="outline" onClick={handleCreatePolicy}>
              Create Policy
            </Button>
          )}

          <Flex alignItems={'center'} display={{ base: 'none', md: 'flex' }}>
            <Menu>
              <MenuButton
                as={Button}
                border="none"
                variant={'outline'}
                cursor={'pointer'}
                minW={0}
              >
                <Box
                  display={'flex'}
                  justifyContent="flex-start"
                  alignItems={'center'}
                >
                  <Avatar
                    size={'xs'}
                    src={
                      'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                    }
                  />
                  <Text
                    color="#231F20"
                    pl="5px"
                    as="b"
                    size="xs"
                    style={{ textTransform: 'uppercase' }}
                  >
                    {username?.firstName !== null && username?.firstName}
                  </Text>
                  <MdArrowDropDown
                    size="25px"
                    color="#231F20"
                    style={{ paddingLeft: '4px' }}
                  />
                </Box>
              </MenuButton>
              <MenuList>
                {/* <Link to="/">     */}
                <MenuItem fontSize="14px" onClick={handleLogout}>
                  <Box
                    w="100%"
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <MdLogout
                      color="blue"
                      style={{ fontSize: '15px', marginRight: '4px' }}
                    />
                    <Text fontSize="sm" as="b" color="grey">
                      Logout
                    </Text>
                  </Box>
                </MenuItem>
                {/* </Link> */}
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Box minH="100vh">
              {/* <SidebarContent
                onClose={() => onClose}
                display={{ base: 'none', md: 'block' }}
              /> */}
              <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full"
              >
                <DrawerContent>
                  <SidebarContent onClose={onClose} />
                </DrawerContent>
              </Drawer>
              {/* mobilenav */}
              {/* <MobileNav onOpen={onOpen} /> */}
              {/* <Box ml={{ base: 0, md: 60 }} p="4">
                {children}
              </Box> */}
            </Box>
          </Box>
        ) : null}
      </Box>

      {/* <Box p={4}>List Policy</Box> */}
    </>
  );
}
