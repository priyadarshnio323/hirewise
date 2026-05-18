'use client';

import { useRouter} from 'next/navigation';
import { Button } from './Button';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
    const router = useRouter();
  return (
    <Button variant="outline" className="w-fit" onClick={() => router.back()}>
        <ArrowLeft className="size-4" />
        Back
    </Button>  
  )
}

export default BackButton;