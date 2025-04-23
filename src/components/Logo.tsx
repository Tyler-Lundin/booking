import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function LogoFull() {
  return (
    <Link href="/" className={`flex items-center space-x-1`}>
        <>
          <FoxTail size="w-8 h-8" />

          <span className="text-2xl font-light text-gray-900 tracking-tight">
            <ol className="flex items-center space-x-1 uppercase">
              <li>s</li>
              <li>l</li>
              <li className="relative w-6 h-6 bg-gray-900 rounded-full">            
                <Image
                src="/assets/fox-head.png"
                alt="Fox Head Logo"
                fill
                className="object-contain "
                priority
              /></li>
              <li>t</li>
            </ol>
          </span>
          <span className="text-2xl font-extrabold text-gray-900 tracking-tight bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
            FOX
          </span>
        </>
    </Link>
  );
} 

export function LogoShort() {
  return (
    <Link href="/" className={`flex items-center space-x-1`}>
      <div className="relative w-8 h-8">
        <Image
          src="/assets/fox-head.png"
          alt="Fox Head Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
        FOX
      </span>
    </Link>
  );
}


export function FoxHead({ size = 'w-8 h-8' }: { size?: string }) {
  return (
    <div className={`relative ${size}`}>
      <Image src="/assets/fox-head.png" alt="Fox Head Logo" fill className="object-contain" priority />
    </div>
  );
}

export function FoxTail({ size = 'w-8 h-8' }: { size?: string }) {
  return (
    <div className={`relative ${size}`}>
      <Image src="/assets/fox-tail.png" alt="Fox Tail Logo" fill className="object-contain" priority />
    </div>
  );
}