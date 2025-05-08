package be.lomagnette.entities;

import be.lomagnette.rest.PuppySearchForm;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.persistence.*;

import java.util.*;

@Entity
public class Puppy extends PanacheEntity {

    public String name;
    public String breed;
    public int age;
    @Enumerated(EnumType.STRING)
    public Size size;
    @Enumerated(EnumType.STRING)
    public Gender gender;
    @Enumerated(EnumType.STRING)
    public ActivityLevel activityLevel;
    @ElementCollection(targetClass = String.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "dog-quality", joinColumns = @JoinColumn(name = "puppy_id"))
    @Column(name = "dog-quality", nullable = false)
    public Set<String> goodWith;
    public String description;
    public String imageUrl;
    public boolean available;

    public static List<Puppy> search(PuppySearchForm form) {

        StringBuilder query = new StringBuilder("1=1");
        Map<String, Object> params = new HashMap<>();

        if (form.breed() != null && !form.breed().isBlank()) {
            query.append(" and breed = :breed");
            params.put("breed", form.breed());
        }

        if (form.minAge() != null) {
            query.append(" and age >= :minAge");
            params.put("minAge", form.minAge());
        }

        if (form.maxAge() != null) {
            query.append(" and age <= :maxAge");
            params.put("maxAge", form.maxAge());
        }

        if (form.size() != null && !form.size().isBlank()) {
            query.append(" and size = :size");
            params.put("size", Size.valueOf(form.size().toUpperCase()));
        }

        if (form.gender() != null && !form.gender().isBlank()) {
            query.append(" and gender = :gender");
            params.put("gender", Gender.valueOf(form.gender().toUpperCase()));
        }

        if (form.activityLevel() != null && !form.activityLevel().isBlank()) {
            query.append(" and activityLevel = :activityLevel");
            params.put("activityLevel", ActivityLevel.valueOf(form.activityLevel().toUpperCase()));
        }

        if (form.onlyAvailable()) {
            query.append(" and available = true");
        }

        if (form.searchTerm() != null && !form.searchTerm().isBlank()) {
            query.append(" and (lower(name) like :term or lower(description) like :term)");
            params.put("term", "%" + form.searchTerm().toLowerCase() + "%");
        }

        List<Puppy> puppies = Puppy.find(query.toString(), params).list();

        // In-memory filtering for goodWith (since it's a collection)
        if (form.goodWith() != null && form.goodWith().length > 0) {
            puppies = puppies.stream()
                    .filter(p -> p.goodWith != null && p.goodWith.containsAll(Arrays.asList(form.goodWith())))
                    .toList();
        }

        return puppies;
    }
}
