import React from 'react'
import {
Box,
Stack,
Text,
Heading,
RadioGroup,
Radio,
Button
} from '@chakra-ui/react'
import { useSelector } from "react-redux"
import {useDispatch} from 'react-redux'
import {selectCurrentStep, setFormState,selectClaimType } from '../createClaimSlice'

const StepForm1 = () => {
  const dispatch = useDispatch()
  const selected = useSelector(selectClaimType)
  const current = useSelector(selectCurrentStep)

  const onSelectClaim = (selected) => {
    const data = {
        step: current,
        selected
        }
    dispatch(setFormState(data))
  }

    const handleNext = (e) => {
      e.preventDefault()
      const data = {
        step: current+1,
        selected
        }
        dispatch(setFormState(data))
    }
  
  return (
    <Stack>
      <Box border={'1px'} borderColor="#ebebeb" p="12px">
        <Heading as="h4" style={{fontSize:'18px'}} fontSize="sm" color="#065BAA" textAlign={'center'}>Select Claim </Heading>
      </Box>
      <Box >
        <Box p="1em" display={'flex'} flexDirection={'column'} border="1px" borderColor={'#ebebeb'} borderTop={'none'}>
          <Box mb="20px" display={'flex'} justifyContent="center" flexDirection={'column'} alignItems="flex-start">
            <Text as="b" fontSize="sm" color="#231F20"  fontFamily={'Mulish'} style={{fontSize:'18px'}}>What happened ? </Text>
            <Text as="p" fontSize="sm" color="#231F20"  mt="2" mb="25px" fontFamily={'Mulish'} style={{ fontSize: '14px' }}>Select the claim available for your incident </Text>
          </Box>
          <RadioGroup defaultValue={selected} onChange={onSelectClaim}>
        <Stack spacing={4} direction='column'>
            <Radio value='Kematian akibat kecelakaan dan cacat tetap'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Kematian akibat kecelakaan dan cacat tetap</Text></Radio>
            <Radio value='Biaya rawat inap dan perawatan di luar negeri'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Biaya rawat inap dan perawatan di luar negeri</Text></Radio>
            <Radio value='Perawatan tindak lanjut di indonesia'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Perawatan tindak lanjut di indonesia</Text></Radio>
            <Radio value='Kunjungan perjalanan penghiburan dan perlindungan anah dibawah umur'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Kunjungan perjalanan penghiburan dan perlindungan anah dibawah umur</Text></Radio>
            <Radio value='Pemulangan dan evakuasi darurat medis'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Pemulangan dan evakuasi darurat medis</Text></Radio>
            <Radio value='Pemulangan jenazah'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Pemulangan jenazah</Text></Radio>
            <Radio value='Pembatalan perjalanan'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Pembatalan perjalanan</Text></Radio>
            <Radio value='Keterlambatan perjalanan dan pengalihan perjalanan'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Keterlambatan perjalanan dan pengalihan perjalanan</Text></Radio>
            <Radio value='Kesalahan rangkaian perjalanan'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Kesalahan rangkaian perjalanan</Text></Radio>
            <Radio value='Pembajakan'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Pembajakan</Text></Radio>
            <Radio value='Keterlambatan bagasi'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Keterlambatan bagasi</Text></Radio>
            <Radio value='Kehilangan atau kerusakan bagasi dan barang pribadi dan laptop'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Kehilangan atau kerusakan bagasi dan barang pribadi dan laptop</Text></Radio>
            <Radio value='Kehilangan dokumen dan uang'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Kehilangan dokumen dan uang</Text></Radio>
            <Radio value='Penyalahgunaan dan perlindungan kartu kredit'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Penyalahgunaan dan perlindungan kartu kredit</Text></Radio>
            <Radio value='Kompensasi kehilangan poin'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Kompensasi kehilangan poin</Text></Radio>
            <Radio value='Tanggung jawab pihak ketiga'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Tanggung jawab pihak ketiga</Text></Radio>
            <Radio value='Internet dan panggilan telepon darurat'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Internet dan panggilan telepon darurat</Text></Radio>
            <Radio value='Perlindungan kelebihan sewa mobil'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Perlindungan kelebihan sewa mobil</Text></Radio>
            <Radio value='Kerusakan atau Kehilangan Peralatan Golf'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Kerusakan atau Kehilangan Peralatan Golf</Text></Radio>
            <Radio value='24 jam bantuan dan 24 jam bantuan medis'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>24 jam bantuan dan 24 jam bantuan medis</Text></Radio>
            <Radio value='Ketidaksinambungan perjalanan'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Ketidaksinambungan perjalanan</Text></Radio>
            <Radio value='Kehilangan fasilitas hotel'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Kehilangan fasilitas hotel</Text></Radio>
            <Radio value='Rebooking ticket'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Rebooking ticket</Text></Radio>
            <Radio value='Penolakan permohonan visa'><Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>Penolakan permohonan visa</Text></Radio>
        </Stack>
        </RadioGroup>
      </Box>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} p="9px" borderRadius={'5px'} border="1px" borderColor={'#ebebeb'}>
        <Box display={'flex'} justifyContent={'flex-start'}>
          <Text as="p" size={'sm'} fontFamily={'Mulish'} style={{fontSize:"14px"}}>
            Claim Selected :
          </Text>
          <Text as="b" size={'sm'}fontFamily={'Mulish'} style={{fontSize:"14px"}}>
            {selected ? selected : ""}
          </Text>
        </Box>
        <Button isDisabled={selected ==="" ? true : false} variant={'ClaimBtn'} style={{textTransform:'uppercase',fontSize:'14px'}} fontFamily="arial" fontWeight={'700'} onClick={handleNext}>Select Traveller</Button>
      </Box>
      </Box>
    </Stack>
  )
 }
export default StepForm1