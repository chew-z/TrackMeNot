#!/usr/bin/env perl

use strict;
use warnings;
use feature qw(say);



my $outfile = 'zeitgeist.txt';
open(my $fh, '>', $outfile) or die "Cannot create $outfile, $!\n";

my $file = $ARGV[0] or die "Need to get file containing words on the command line\n";
open(my $data, '<', $file) or die "Could not open '$file' $!\n";

my $linenumber = 0;
print $fh "[";
while (my $line = <$data>) {
    $linenumber += 1;
    chomp $line;
    my $word = qq{"$line",};
    print $fh "$word";

}
print $fh "]";
close $fh or die "Error in closing the file ", __FILE__, " $!\n";
