package com.cherrycake.catalog.service;

import com.cherrycake.catalog.dto.CategoryDto;
import com.cherrycake.catalog.dto.ModifierGroupDto;
import com.cherrycake.catalog.dto.ProductDto;
import com.cherrycake.catalog.dto.ProductModifierDto;
import com.cherrycake.catalog.dto.RegionDto;
import com.cherrycake.catalog.entity.Category;
import com.cherrycake.catalog.entity.Product;
import com.cherrycake.catalog.entity.ProductModifier;
import com.cherrycake.catalog.entity.ProductPrice;
import com.cherrycake.catalog.entity.Region;
import com.cherrycake.catalog.repository.CategoryRepository;
import com.cherrycake.catalog.repository.ProductPriceRepository;
import com.cherrycake.catalog.repository.ProductRepository;
import com.cherrycake.catalog.repository.RegionRepository;
import com.cherrycake.common.exception.BadRequestException;
import com.cherrycake.common.exception.ResourceNotFoundException;
import com.cherrycake.order.dto.DeliveryZoneDto;
import com.cherrycake.order.dto.PickupPointDto;
import com.cherrycake.order.dto.TimeSlotResponse;
import com.cherrycake.order.entity.TimeSlot;
import com.cherrycake.order.repository.DeliveryZoneRepository;
import com.cherrycake.order.repository.PickupPointRepository;
import com.cherrycake.order.repository.TimeSlotRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CatalogService
{
    private final RegionRepository regionRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductPriceRepository productPriceRepository;
    private final PickupPointRepository pickupPointRepository;
    private final DeliveryZoneRepository deliveryZoneRepository;
    private final TimeSlotRepository timeSlotRepository;

    public List<RegionDto> getAllActiveRegions()
    {
        return regionRepository.findAllByActiveTrue().stream().map(this::mapToRegionDto).collect(Collectors.toList());
    }

    public List<CategoryDto> getAllCategories()
    {
        return categoryRepository.findAllByOrderByDisplayOrderAsc().stream().map(this::mapToCategoryDto).collect(Collectors.toList());
    }

    public List<ProductDto> getProducts(String regionCode, Long categoryId)
    {
        if (regionCode == null || regionCode.trim().isEmpty())
        {
            throw new BadRequestException("Region parameter is required");
        }

        Region region = regionRepository.findByCodeIgnoreCase(regionCode.trim())
            .orElseThrow(() -> new ResourceNotFoundException("Region not found: " + regionCode));

        List<Product> products = (categoryId != null)
            ? productRepository.findByCategoryIdAndAvailableTrue(categoryId)
            : productRepository.findAllByAvailableTrue();

        return products.stream().map(p -> mapToProductDto(p, region)).collect(Collectors.toList());
    }

    public ProductDto getProductById(Long productId, String regionCode)
    {
        if (regionCode == null || regionCode.trim().isEmpty())
        {
            throw new BadRequestException("Region parameter is required");
        }

        Region region = regionRepository.findByCodeIgnoreCase(regionCode.trim())
            .orElseThrow(() -> new ResourceNotFoundException("Region not found: " + regionCode));

        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        return mapToProductDto(product, region);
    }

    public List<PickupPointDto> getPickupPoints(String regionCode)
    {
        if (regionCode != null && !regionCode.trim().isEmpty())
        {
            return pickupPointRepository.findByRegionCodeIgnoreCaseAndActiveTrue(regionCode.trim()).stream().map
            (p -> PickupPointDto.builder()
                .id(p.getId())
                .regionId(p.getRegion().getId())
                .name(p.getName())
                .address(p.getAddress())
                .workingHours(p.getWorkingHours())
                .build()
            ).collect(Collectors.toList());
        }
        return pickupPointRepository.findAll().stream().filter(p -> p.isActive()).map
        (p -> PickupPointDto.builder()
            .id(p.getId())
            .regionId(p.getRegion().getId())
            .name(p.getName())
            .address(p.getAddress())
            .workingHours(p.getWorkingHours())
            .build()
        ).collect(Collectors.toList());
    }

    public List<DeliveryZoneDto> getDeliveryZones(String regionCode)
    {
        if (regionCode != null && !regionCode.trim().isEmpty())
        {
            return deliveryZoneRepository.findByRegionCodeIgnoreCaseAndActiveTrue(regionCode.trim()).stream().map
            (z -> DeliveryZoneDto.builder()
                .id(z.getId())
                .regionId(z.getRegion().getId())
                .name(z.getName())
                .deliveryFee(z.getDeliveryFee())
                .estimatedMinutes(z.getEstimatedMinutes())
                .build()
            ).collect(Collectors.toList());
        }
        return deliveryZoneRepository.findAll().stream().filter(z -> z.isActive()).map
        (z -> DeliveryZoneDto.builder()
            .id(z.getId())
            .regionId(z.getRegion().getId())
            .name(z.getName())
            .deliveryFee(z.getDeliveryFee())
            .estimatedMinutes(z.getEstimatedMinutes())
            .build()
        ).collect(Collectors.toList());
    }

    public List<TimeSlotResponse> getTimeSlots(LocalDate date)
    {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        List<TimeSlot> slots = timeSlotRepository.findAll();

        List<TimeSlotResponse> responses = new ArrayList<>();
        if (slots.isEmpty())
        {
            // Fallback generation for common working hours 10:00 - 20:00
            LocalTime[] times = new LocalTime[] {
                LocalTime.of(10, 0), LocalTime.of(11, 0), LocalTime.of(12, 30),
                LocalTime.of(14, 0), LocalTime.of(15, 30), LocalTime.of(17, 0),
                LocalTime.of(18, 30), LocalTime.of(20, 0)
            };
            long idGen = 1;
            for (LocalTime t : times)
            {
                responses.add(TimeSlotResponse.builder()
                    .id(idGen++)
                    .date(targetDate)
                    .startTime(t)
                    .endTime(t.plusMinutes(60))
                    .capacity(10)
                    .bookedCount(0)
                    .isAvailable(true)
                    .build());
            }
        }
        else
        {
            for (TimeSlot ts : slots)
            {
                LocalDate slotD = ts.getSlotDate() != null ? ts.getSlotDate() : targetDate;
                LocalTime startT = ts.getStartTime() != null ? ts.getStartTime() : LocalTime.of(12, 0);
                LocalTime endT = ts.getEndTime() != null ? ts.getEndTime() : startT.plusMinutes(60);

                responses.add(TimeSlotResponse.builder()
                    .id(ts.getId())
                    .date(slotD)
                    .startTime(startT)
                    .endTime(endT)
                    .capacity(ts.getCapacity())
                    .bookedCount(ts.getReservedCount())
                    .isAvailable(ts.isAvailable())
                    .build());
            }
        }
        return responses;
    }

    private RegionDto mapToRegionDto(Region region)
    {
        return RegionDto.builder()
            .id(region.getId())
            .code(region.getCode())
            .name(region.getName())
            .currencyCode(region.getCurrencyCode())
            .currencySymbol(region.getCurrencySymbol())
            .vatRate(region.getVatRateFraction())
            .active(region.isActive())
            .build();
    }

    private CategoryDto mapToCategoryDto(Category category)
    {
        return CategoryDto.builder()
            .id(category.getId())
            .code(category.getCode())
            .name(category.getName())
            .description(category.getDescription())
            .displayOrder(category.getDisplayOrder())
            .sortOrder(category.getDisplayOrder())
            .build();
    }

    private ProductDto mapToProductDto(Product product, Region region)
    {
        Optional<ProductPrice> priceOpt = productPriceRepository.findByProductIdAndRegionId(product.getId(), region.getId());
        BigDecimal price = priceOpt.map(ProductPrice::getPrice).orElse(BigDecimal.ZERO);
        boolean isAvailable = product.isAvailable() && priceOpt.map(ProductPrice::isAvailable).orElse(false);

        List<ProductModifierDto> modifierDtos = product.getModifiers().stream().map
        (m -> ProductModifierDto.builder()
            .id(m.getId())
            .name(m.getName())
            .priceDelta(m.getPriceDelta())
            .isDefault(m.isDefault())
            .build()
        ).collect(Collectors.toList());

        // Group modifiers into ModifierGroupDto
        Map<String, List<ProductModifier>> groupMap = new LinkedHashMap<>();
        for (ProductModifier m : product.getModifiers())
        {
            String groupName = m.getGroupName() != null ? m.getGroupName() : "Options";
            groupMap.computeIfAbsent(groupName, k -> new ArrayList<>()).add(m);
        }

        List<ModifierGroupDto> groupDtos = new ArrayList<>();
        long gId = 1;
        for (Map.Entry<String, List<ProductModifier>> entry : groupMap.entrySet())
        {
            List<ProductModifier> gMods = entry.getValue();
            String gType = gMods.isEmpty() ? "MULTI" : (gMods.get(0).getGroupType() != null ? gMods.get(0).getGroupType() : "MULTI");
            boolean gReq = gMods.stream().anyMatch(ProductModifier::isRequired);

            List<ModifierGroupDto.ModifierItemDto> items = gMods.stream().map(
                m -> ModifierGroupDto.ModifierItemDto.builder()
                    .id(m.getId())
                    .name(m.getName())
                    .priceDelta(m.getPriceDelta())
                    .build()
            ).collect(Collectors.toList());

            groupDtos.add(ModifierGroupDto.builder()
                .id(gId++)
                .name(entry.getKey())
                .type(gType)
                .isRequired(gReq)
                .modifiers(items)
                .build());
        }

        return ProductDto.builder()
            .id(product.getId())
            .code(product.getCode())
            .name(product.getName())
            .description(product.getDescription())
            .imageUrl(product.getImageUrl())
            .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
            .categoryName(product.getCategory() != null ? product.getCategory().getName() : "")
            .price(price)
            .currencyCode(region.getCurrencyCode())
            .currencySymbol(region.getCurrencySymbol())
            .isAvailable(isAvailable)
            .modifiers(modifierDtos)
            .modifierGroups(groupDtos)
            .build();
    }
}
