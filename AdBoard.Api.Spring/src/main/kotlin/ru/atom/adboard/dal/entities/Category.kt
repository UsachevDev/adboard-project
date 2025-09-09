package ru.atom.adboard.dal.entities
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "categories")
data class Category(
    @Id
    @Column(name = "id", columnDefinition = "UUID")
    val id: UUID = UUID.randomUUID(),

    @Column(name = "name", nullable = false)
    val name: String,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "category")
    val subcategories:  List<Subcategory> = Collections.emptyList()
)
