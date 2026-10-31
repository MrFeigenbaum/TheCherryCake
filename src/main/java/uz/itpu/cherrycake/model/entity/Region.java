package uz.itpu.cherrycake.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Table(name = "regions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Region
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 10)
    private String code; // e.g. "UZ", "KZ", "RU"

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "currency_code", nullable = false, length = 10)
    private String currencyCode; // e.g. "UZS", "KZT", "RUB"

    @Column(name = "currency_symbol", nullable = false, length = 10)
    private String currencySymbol; // e.g. "soʻm", "₸", "₽"

    @Column(name = "vat_rate", nullable = false, precision = 5, scale = 4)
    private BigDecimal vatRate; // stored as 0.1200 or 12.00

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;

    public BigDecimal getVatRateFraction()
    {
        if (vatRate == null) return BigDecimal.ZERO;
        if (vatRate.compareTo(BigDecimal.ONE) > 0)
        {
            return vatRate.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
        }
        return vatRate.setScale(4, RoundingMode.HALF_UP);
    }
}
