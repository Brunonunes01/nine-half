import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/layout/Header';
import ScreenContainer from '../../components/layout/ScreenContainer';
import Button from '../../components/ui/Button';
import ImagePickerButton from '../../components/ui/ImagePickerButton';
import Input from '../../components/ui/Input';
import { PRODUCT_ORIGIN } from '../../constants/productOrigin';
import { useAuth } from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';
import { uploadProductImage } from '../../services/storageService';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { colors } from '../../theme/colors';
import { validateRequired } from '../../utils/validators';

const MAX_IMAGES = 5;
const EXPIRY_OPTIONS = [
  { label: '1h', value: 1 }, { label: '2h', value: 2 }, { label: '6h', value: 6 },
  { label: '12h', value: 12 }, { label: '24h', value: 24 }, { label: '48h', value: 48 }
];

export default function ProductFormScreen({ navigation, route }: any) {
  const { user } = useAuth();
  const { createProduct, updateProduct, loadProductById, selectedProduct, loading } = useProducts();

  const mode = route.params?.mode || 'create';
  const showcaseId = route.params?.showcaseId || '';
  const productId = route.params?.productId || '';

  const [modelo, setModelo] = useState('');
  const [marca, setMarca] = useState('');
  const [numeracao, setNumeracao] = useState('');
  const [preco, setPreco] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [origem, setOrigem] = useState(PRODUCT_ORIGIN.OWN);
  const [tempoReserva, setTempoReserva] = useState(24);

  const [remoteImages, setRemoteImages] = useState<string[]>([]);
  const [remotePaths, setRemotePaths] = useState<string[]>([]);
  const [localImages, setLocalImages] = useState<string[]>([]);
  const [formError, setFormError] = useState('');
  const [imageLoading, setImageLoading] = useState(false);

  const totalImages = remoteImages.length + localImages.length;

  useEffect(() => {
    if (mode !== 'edit' || !productId) return;
    loadProductById(productId);
  }, [mode, productId]);

  useEffect(() => {
    if (!selectedProduct || mode !== 'edit') return;
    setModelo(selectedProduct.modelo || '');
    setMarca(selectedProduct.marca || '');
    setNumeracao(String(selectedProduct.numeracao || ''));
    setPreco(String(selectedProduct.preco || ''));
    setLocalizacao(selectedProduct.localizacao || '');
    setOrigem(selectedProduct.origem || PRODUCT_ORIGIN.OWN);
    setTempoReserva(selectedProduct.tempoReserva || 24);
    const existingImages = Array.isArray(selectedProduct.imagens)
      ? selectedProduct.imagens
      : (selectedProduct.imagemUrl ? [selectedProduct.imagemUrl] : []);
    const existingPaths = Array.isArray(selectedProduct.imagePaths)
      ? selectedProduct.imagePaths
      : (selectedProduct.imagePath ? [selectedProduct.imagePath] : []);
    setRemoteImages(existingImages.slice(0, MAX_IMAGES));
    setRemotePaths(existingPaths.slice(0, MAX_IMAGES));
  }, [selectedProduct, mode]);

  async function handlePickImage() {
    if (totalImages >= MAX_IMAGES) {
      setFormError(`Limite maximo de ${MAX_IMAGES} imagens por produto.`);
      return;
    }

    setImageLoading(true);
    setFormError('');
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permissao negada', 'Precisamos de acesso a galeria para selecionar imagens.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1
      });

      if (result.canceled || !result.assets?.[0]?.uri) return;

      const compressed = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 1200 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      setLocalImages((prev) => [...prev, compressed.uri].slice(0, MAX_IMAGES));
    } catch (_) {
      setFormError('Erro ao selecionar imagem.');
    } finally {
      setImageLoading(false);
    }
  }

  function removeRemoteImage(index: number) {
    setRemoteImages((prev) => prev.filter((_, i) => i !== index));
    setRemotePaths((prev) => prev.filter((_, i) => i !== index));
  }

  function removeLocalImage(index: number) {
    setLocalImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    setFormError('');
    if (!validateRequired(modelo) || !validateRequired(marca) || !validateRequired(preco)) {
      setFormError('Preencha os campos obrigatorios.');
      return;
    }
    if (mode === 'create' && !showcaseId) {
      setFormError('Vitrine nao encontrada.');
      return;
    }

    try {
      const baseData = {
        modelo: modelo.trim(),
        marca: marca.trim(),
        numeracao: numeracao.trim(),
        preco: preco.trim(),
        localizacao: localizacao.trim(),
        origem: origem.trim(),
        tempoReserva: Number(tempoReserva)
      };

      let currentId = productId;
      if (mode === 'edit') {
        await updateProduct(productId, baseData);
      } else {
        const created = await createProduct({
          ...baseData,
          showcaseId,
          ownerId: user.uid,
          imagens: [],
          imagePaths: [],
          imagemUrl: '',
          imagePath: ''
        });
        currentId = created.id;
      }

      const uploadedUrls: string[] = [];
      const uploadedPaths: string[] = [];
      for (let i = 0; i < localImages.length; i += 1) {
        if (remoteImages.length + uploadedUrls.length >= MAX_IMAGES) break;
        const upload = await uploadProductImage({
          userId: user.uid,
          productId: `${currentId}-${Date.now()}-${i}`,
          imageUri: localImages[i]
        });
        uploadedUrls.push(upload.imageUrl);
        uploadedPaths.push(upload.imagePath);
      }

      const finalImages = [...remoteImages, ...uploadedUrls].slice(0, MAX_IMAGES);
      const finalPaths = [...remotePaths, ...uploadedPaths].slice(0, MAX_IMAGES);
      await updateProduct(currentId, {
        imagens: finalImages,
        imagePaths: finalPaths,
        imagemUrl: finalImages[0] || '',
        imagePath: finalPaths[0] || ''
      });

      navigation.goBack();
    } catch (err: any) {
      setFormError(err?.message || 'Erro ao salvar produto.');
    }
  }

  return (
    <ScreenContainer scroll>
      <Header title={mode === 'edit' ? 'Editar Sneaker' : 'Novo Sneaker'} showBack />

      <View style={styles.form}>
        <Text style={styles.sectionLabel}>IMAGENS ({totalImages}/{MAX_IMAGES})</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imagesRow}>
          {remoteImages.map((uri, index) => (
            <View key={`remote-${index}`} style={styles.imageBox}>
              <Image source={{ uri }} style={styles.imageThumb} />
              <Pressable style={styles.removeBtn} onPress={() => removeRemoteImage(index)}>
                <Ionicons name="close-circle" size={22} color={colors.danger} />
              </Pressable>
            </View>
          ))}
          {localImages.map((uri, index) => (
            <View key={`local-${index}`} style={styles.imageBox}>
              <Image source={{ uri }} style={styles.imageThumb} />
              <Pressable style={styles.removeBtn} onPress={() => removeLocalImage(index)}>
                <Ionicons name="close-circle" size={22} color={colors.danger} />
              </Pressable>
            </View>
          ))}
        </ScrollView>
        {totalImages < MAX_IMAGES ? <ImagePickerButton onPress={handlePickImage} loading={imageLoading} /> : null}

        <Text style={styles.sectionLabel}>INFORMACOES BASICAS</Text>
        <Input label="Modelo *" value={modelo} onChangeText={setModelo} />
        <Input label="Marca *" value={marca} onChangeText={setMarca} />
        <View style={styles.row}>
          <View style={styles.col}><Input label="Tamanho *" value={numeracao} onChangeText={setNumeracao} keyboardType="numeric" /></View>
          <View style={styles.col}><Input label="Preco (R$) *" value={preco} onChangeText={setPreco} keyboardType="decimal-pad" /></View>
        </View>
        <Input label="Localizacao (Cidade/Estado)" value={localizacao} onChangeText={setLocalizacao} />

        <Text style={styles.sectionLabel}>ESTRATEGIA DE VENDA</Text>
        <View style={styles.optionsGrid}>
          {EXPIRY_OPTIONS.map((opt) => (
            <Pressable key={opt.value} style={[styles.optBtn, tempoReserva === opt.value && styles.optBtnActive]} onPress={() => setTempoReserva(opt.value)}>
              <Text style={[styles.optText, tempoReserva === opt.value && styles.optTextActive]}>{opt.label}</Text>
            </Pressable>
          ))}
        </View>

        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}
        <Button title={mode === 'edit' ? 'Salvar alteracoes' : 'Cadastrar tenis'} onPress={handleSubmit} loading={loading || imageLoading} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  form: { paddingBottom: spacing.xxl },
  sectionLabel: {
    fontWeight: '800',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
    textTransform: 'uppercase'
  },
  imagesRow: {
    gap: spacing.sm,
    paddingBottom: spacing.sm
  },
  imageBox: {
    width: 90,
    height: 90,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border
  },
  imageThumb: {
    width: '100%',
    height: '100%'
  },
  removeBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.white,
    borderRadius: 11
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md
  },
  col: {
    flex: 1
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.lg
  },
  optBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border
  },
  optBtnActive: {
    borderColor: colors.secondary,
    backgroundColor: colors.secondarySoft
  },
  optText: {
    fontWeight: '700',
    color: colors.textSecondary
  },
  optTextActive: {
    color: colors.secondary
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    marginTop: spacing.md
  }
});
