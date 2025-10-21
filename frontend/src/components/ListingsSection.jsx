import RoommateCard from "./RoommateCard";

// This component is now "dumb" - it just displays what it's given.
const ListingsSection = ({ listings, title }) => {
  
  return (
    <section id="listings" className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          
          {/* Show count only if listings are provided */}
          {listings && listings.length > 0 && (
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Found {listings.length} matching roommate(s).
            </p>
          )}
        </div>

        {/* Handle "No Results" case */}
        {listings && listings.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-2xl font-semibold">No Results Found</h3>
            <p className="text-muted-foreground mt-2">
              Try a different location or check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings && listings.map((listing) => (
              <RoommateCard 
                key={listing._id}
                userId={listing._id} // <-- THIS IS THE NEW PROP
                name={listing.name}
                age={listing.age}
                occupation={listing.occupation}
                location={listing.location}
                budget={listing.budget}
                avatarUrl={listing.profilePic}
                tags={listing.lifestyle || []}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ListingsSection;