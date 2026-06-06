import {Link, type LinkProps} from '@chakra-ui/react'

export const NavLink =  ({ children, ...props }: LinkProps) =>(
    <Link
        position="relative"
        textDecoration="none"
        pb={1}
        _after={{
            content: '""',
            position: 'absolute',
            width: '0',
            height: '2px',
            bottom: '0',
            left: '0',
            bg: 'purple.600',
            transition: 'width 0.3s ease-in-out'
        }}
        _hover={{
            
            _after: { width: '100%' }
        }}
        {...props}
    >
        {children}
    </Link>
)