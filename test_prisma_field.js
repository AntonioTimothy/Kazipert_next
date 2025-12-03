
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Checking Prisma Client fields...');
    // We don't need to actually create a job, just check if the model has the field
    // by inspecting the dmmf (Data Model Meta Format) if accessible, 
    // or simply by trying to validate a query (which might fail but give a different error).

    // Better yet, let's look at the Prisma Client instance internals or just try a dry run.
    // We'll try to count jobs with a filter on the new field. 
    // If the field doesn't exist, it will throw the "Unknown argument" error.

    try {
        // Attempt to access the field in a query
        // We use a dummy ID that won't match anything
        const count = await prisma.job.count({
            where: {
                additionalDuties: {
                    equals: "test" // This is just to trigger the field validation
                }
            }
        });
        console.log('✅ Field "additionalDuties" is recognized by Prisma Client.');
    } catch (e) {
        if (e.message.includes('Unknown argument')) {
            console.error('❌ Field "additionalDuties" is NOT recognized:', e.message);
        } else {
            // If it fails with a type error (Json filter issues) or DB error, 
            // it means the field IS recognized but maybe used wrong, which is fine for this test.
            console.log('✅ Field "additionalDuties" seems to be recognized (error was not "Unknown argument"):');
            console.log(e.message.split('\n')[0]);
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
