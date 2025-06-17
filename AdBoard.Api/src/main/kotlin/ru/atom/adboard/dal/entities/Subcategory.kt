package ru.atom.adboard.dal.entities

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "subcategories")
data class Subcategory(
    @Id
    @Column(name = "id", columnDefinition = "UUID")
    val id: UUID = UUID.randomUUID(),

    @Column(name = "name", nullable = false)
    val name: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonIgnore
    val category: Category,

    @OneToMany(mappedBy = "subcategory", fetch = FetchType.LAZY)
    @JsonIgnore
    val announcements: MutableSet<Announcement> = mutableSetOf()
)
